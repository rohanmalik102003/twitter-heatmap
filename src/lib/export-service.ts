import html2canvas from 'html2canvas';

export class ExportService {
  
  static async exportAsPNG(elementId: string, filename: string = 'twitter-heatmap'): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
      }

      // Create a wrapper with white background and padding for better export
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        background: white;
        padding: 20px;
        display: inline-block;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      
      // Clone the element to avoid modifying the original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      wrapper.appendChild(clonedElement);
      
      // Temporarily add to DOM for rendering
      document.body.appendChild(wrapper);
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '-9999px';

      const canvas = await html2canvas(wrapper, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        removeContainer: true,
        logging: false
      });

      // Clean up
      document.body.removeChild(wrapper);

      // Create download link
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exporting PNG:', error);
      throw new Error('Failed to export as PNG. Please try again.');
    }
  }

  static async exportAsSVG(elementId: string, filename: string = 'twitter-heatmap'): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
      }

      // Get computed styles
      const computedStyles = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      
      // Create SVG
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', rect.width.toString());
      svg.setAttribute('height', rect.height.toString());
      svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
      
      // Add white background
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      background.setAttribute('width', '100%');
      background.setAttribute('height', '100%');
      background.setAttribute('fill', 'white');
      svg.appendChild(background);
      
      // Convert the calendar to SVG format
      await this.convertElementToSVG(element, svg);
      
      // Create blob and download
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      
      const link = document.createElement('a');
      link.download = `${filename}.svg`;
      link.href = URL.createObjectURL(blob);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(link.href);
      
    } catch (error) {
      console.error('Error exporting SVG:', error);
      throw new Error('Failed to export as SVG. Please try again.');
    }
  }

  private static async convertElementToSVG(element: Element, svg: SVGElement): Promise<void> {
    // This is a simplified SVG conversion
    // For a full implementation, you'd need to recursively process all child elements
    // and convert their styles to SVG attributes
    
    const rect = element.getBoundingClientRect();
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('width', rect.width.toString());
    foreignObject.setAttribute('height', rect.height.toString());
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    
    // Clone the element for SVG embedding
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Add styles inline for SVG compatibility
    this.inlineStyles(clonedElement);
    
    foreignObject.appendChild(clonedElement);
    svg.appendChild(foreignObject);
  }

  private static inlineStyles(element: HTMLElement): void {
    const computedStyles = window.getComputedStyle(element);
    let styleString = '';
    
    // Copy important styles
    const importantStyles = [
      'background-color', 'color', 'font-family', 'font-size', 'font-weight',
      'margin', 'padding', 'border', 'border-radius', 'width', 'height',
      'display', 'flex', 'flex-direction', 'justify-content', 'align-items'
    ];
    
    importantStyles.forEach(property => {
      const value = computedStyles.getPropertyValue(property);
      if (value) {
        styleString += `${property}: ${value}; `;
      }
    });
    
    if (styleString) {
      element.style.cssText = styleString;
    }
    
    // Recursively process child elements
    Array.from(element.children).forEach(child => {
      if (child instanceof HTMLElement) {
        this.inlineStyles(child);
      }
    });
  }

  static async shareAsImage(elementId: string): Promise<void> {
    try {
      // Check if Web Share API is supported
      if (!navigator.share && !navigator.clipboard) {
        throw new Error('Sharing is not supported in this browser');
      }

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
      }

      // Convert to canvas
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.95);
      });

      if (navigator.share) {
        // Use Web Share API if available
        const file = new File([blob], 'twitter-heatmap.png', { type: 'image/png' });
        await navigator.share({
          title: 'My Twitter Activity Heatmap',
          text: 'Check out my Twitter activity visualization!',
          files: [file]
        });
      } else if (navigator.clipboard) {
        // Fallback to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('Heatmap copied to clipboard!');
      }
      
    } catch (error) {
      console.error('Error sharing image:', error);
      // Fallback to download
      this.exportAsPNG(elementId, 'twitter-heatmap-shared');
    }
  }
}