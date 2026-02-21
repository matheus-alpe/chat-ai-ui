import { inject, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'markdownToHtml',
  standalone: true,
})
export class MarkdownToHtmlPipe implements PipeTransform {
  readonly sanitizer = inject(DomSanitizer);

  transform(value: string): unknown {
    if (!value) return value;

    try {
      const html = marked.parse(value) as string;
      return this.sanitizeHtml(html);
    } catch (error) {
      // Fallback to original value if parsing fails
      console.error('Error converting markdown to HTML:', error);
      return this.sanitizeHtml(value);
    }
  }

  private sanitizeHtml(html: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }
}
