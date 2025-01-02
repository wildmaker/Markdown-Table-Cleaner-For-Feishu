// 表格清理函数
function cleanMarkdownTable(markdown) {
    console.log("开始清理 Markdown 表格...");
    const lines = markdown.split('\n').map(line => line.trim());

    if (!lines.some(line => line.includes('|'))) {
        console.warn("未检测到有效的 Markdown 表格。");
        return "未检测到有效的 Markdown 表格，请检查输入内容。";
    }

    const cleanedLines = lines.map((line, index) => {
        if (index === 1 && line.match(/^[-| ]+$/)) {
            // 为表头分隔线标准化
            return line.replace(/[- ]+/g, '-').replace(/\|+/g, '|');
        }
        return line.replace(/ {2,}/g, ' '); // 规范空格
    });

    console.log("清理完成：", cleanedLines);

    return cleanedLines.join('\n');
}

// 加载剪贴板内容到文本框
async function loadClipboardContent() {
    const textarea = document.getElementById('clipboard-content');
    const status = document.getElementById('status');
    textarea.value = ""; // 初始化清空输入框
    try {
        const text = await navigator.clipboard.readText();
        console.log("从剪贴板读取内容：", text);
        if (!text.trim()) {
            status.textContent = "剪贴板为空，请先复制内容。";
            status.classList.add("error");
            return;
        }
        textarea.value = text; // 显示剪贴板内容
        status.textContent = ""; // 清空状态提示
    } catch (error) {
        console.error("无法读取剪贴板内容:", error);
        status.textContent = "无权限访问剪贴板，请手动粘贴内容到文本框。";
        status.classList.add("error");
    }
}

// 清理内容并更新剪贴板
async function cleanAndUpdateClipboard() {
    console.log("点击了清理格式按钮...");
    const textarea = document.getElementById('clipboard-content');
    const status = document.getElementById('status');
    const content = textarea.value.trim();

    if (!content) {
        console.warn("输入框为空。");
        status.textContent = "输入框为空，请先粘贴或复制内容。";
        status.classList.add("error");
        return;
    }

    console.log("待清理内容：", content);
    const cleanedContent = cleanMarkdownTable(content);
    console.log("清理后内容：", cleanedContent);

    try {
        await navigator.clipboard.writeText(cleanedContent);
        console.log("内容已更新到剪贴板：", cleanedContent);
        status.textContent = "格式已清理，内容已更新到剪贴板。";
        status.classList.remove("error");
        textarea.value = ""; // 清空输入框
    } catch (error) {
        console.error("无法更新剪贴板:", error);
        status.textContent = "无法更新剪贴板，请手动复制清理后的内容。";
        status.classList.add("error");
    }
}

// 设置事件监听
document.getElementById('clean-button').addEventListener('click', cleanAndUpdateClipboard);

// 加载剪贴板内容
loadClipboardContent();
