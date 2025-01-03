document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('clipboard-content');
    const button = document.getElementById('clean-button');
  
    // 清理表格内容函数
    function cleanMarkdownTable(markdown) {
      console.log('开始清理 Markdown 表格...');
      const lines = markdown.split('\n').map(line => line.trim());
      if (!lines.some(line => line.includes('|'))) {
        console.warn('未检测到有效的 Markdown 表格');
        return '未检测到有效的 Markdown 表格，请检查输入内容。';
      }
      const cleanedLines = lines.map((line, index) => {
        if (index === 1 && line.match(/^[-| ]+$/)) {
          return line.replace(/[- ]+/g, '-').replace(/\|+/g, '|');
        }
        return line.replace(/ {2,}/g, ' ');
      });
      console.log('清理完成:', cleanedLines);
      return cleanedLines.join('\n');
    }
  
    // 点击按钮时清理内容并更新剪贴板
    button.addEventListener('click', async () => {
      const content = textarea.value.trim();
      if (!content) {
        alert('输入框为空，请先粘贴内容');
        return;
      }
      const cleanedContent = cleanMarkdownTable(content);
      try {
        await navigator.clipboard.writeText(cleanedContent);
        button.textContent = '✅ 已复制到粘贴板';
        button.classList.add('success');
      } catch (error) {
        console.error('无法写入剪贴板:', error);
        alert('无法复制内容到剪贴板，请检查权限设置');
      }
    });
  
    // 聚焦输入框时重置按钮状态并清空内容
    textarea.addEventListener('focus', () => {
      if (textarea.value.trim()) {
        textarea.value = '';
        button.textContent = '清理格式';
        button.classList.remove('success');
      }
    });
  });
  