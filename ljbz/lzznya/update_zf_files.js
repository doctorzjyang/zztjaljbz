const fs = require('fs');
const path = require('path');

const directory = __dirname;
const files = fs.readdirSync(directory).filter(file => file.match(/^zf(\d+|zj)\.html$/));

// 生成中风1-30的链接HTML（5列6行）
function generateStrokeLinks(currentFile) {
    let links = '<div class="grid grid-cols-5 gap-2">';
    for (let i = 1; i <= 30; i++) {
        const fileName = `zf${i}.html`;
        const isActive = currentFile === fileName;
        links += `
            <a href="./${fileName}" class="block px-2 py-1 hover:bg-amber-100 rounded text-center text-sm ${isActive ? 'bg-amber-200 font-bold' : ''}">中风${i}</a>`;
    }
    links += '</div>';
    return links;
}

// 处理每个文件
files.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经添加了连接模块
    if (!content.includes('stroke-navigation')) {
        // 在body标签后添加连接模块
        const replacement = '<body class="p-4 md:p-8">\n    <!-- 左侧导航 -->\n    <div class="stroke-navigation fixed top-4 left-4 w-80 bg-white border border-amber-800 rounded-lg shadow-lg p-3 z-10">\n        <div class="font-bold text-amber-800 mb-3 text-center border-b pb-2">中风病案导航</div>\n        <div class="mb-3">\n            <a href="../ljzz/index.html" class="block px-3 py-2 hover:bg-amber-100 rounded text-sm font-medium text-center">回到上级</a>\n        </div>\n' + generateStrokeLinks(file) + '\n    </div>\n    <div class="ml-80">';
        
        const modifiedContent = content.replace('<body class="p-4 md:p-8">', replacement);
        
        // 确保在文件末尾添加闭合div
        if (!modifiedContent.includes('</div>\n</body>')) {
            const finalContent = modifiedContent.replace('</body>', '</div>\n</body>');
            fs.writeFileSync(filePath, finalContent, 'utf8');
        } else {
            fs.writeFileSync(filePath, modifiedContent, 'utf8');
        }
        
        console.log(`Updated: ${file}`);
    } else {
        // 更新现有导航模块
        const linksHTML = generateStrokeLinks(file);
        const updatedContent = content.replace(
            /<div class="space-y-1">[\s\S]*?<\/div>/,
            '<div class="mb-3">\n            <a href="../ljzz/index.html" class="block px-3 py-2 hover:bg-amber-100 rounded text-sm font-medium text-center">回到上级</a>\n        </div>\n' + linksHTML
        );
        
        // 更新导航容器宽度
        const finalContent = updatedContent.replace(
            'stroke-navigation fixed top-4 left-4 w-32',
            'stroke-navigation fixed top-4 left-4 w-80'
        ).replace(
            '<div class="ml-36">',
            '<div class="ml-80">'
        );
        
        fs.writeFileSync(filePath, finalContent, 'utf8');
        console.log(`Updated: ${file}`);
    }
});

console.log('All files processed!');