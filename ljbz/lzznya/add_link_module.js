const fs = require('fs');
const path = require('path');

const directory = __dirname;
const files = fs.readdirSync(directory).filter(file => file.match(/zf\d+\.html$/));

const linkModuleHTML = `        <!-- 左侧链接模块 -->
        <div class="w-full md:w-64 flex-shrink-0">
            <div class="link-module p-4 mb-4">
                <h3 class="text-center font-bold text-lg mb-3 border-b pb-2">中风病案</h3>
                <div class="grid grid-cols-5 gap-2 mb-4">
                    <a href="zf1.html" class="link-item p-2 text-center text-sm rounded">1</a>
                    <a href="zf2.html" class="link-item p-2 text-center text-sm rounded">2</a>
                    <a href="zf3.html" class="link-item p-2 text-center text-sm rounded">3</a>
                    <a href="zf4.html" class="link-item p-2 text-center text-sm rounded">4</a>
                    <a href="zf5.html" class="link-item p-2 text-center text-sm rounded">5</a>
                    <a href="zf6.html" class="link-item p-2 text-center text-sm rounded">6</a>
                    <a href="zf7.html" class="link-item p-2 text-center text-sm rounded">7</a>
                    <a href="zf8.html" class="link-item p-2 text-center text-sm rounded">8</a>
                    <a href="zf9.html" class="link-item p-2 text-center text-sm rounded">9</a>
                    <a href="zf10.html" class="link-item p-2 text-center text-sm rounded">10</a>
                    <a href="zf11.html" class="link-item p-2 text-center text-sm rounded">11</a>
                    <a href="zf12.html" class="link-item p-2 text-center text-sm rounded">12</a>
                    <a href="zf13.html" class="link-item p-2 text-center text-sm rounded">13</a>
                    <a href="zf14.html" class="link-item p-2 text-center text-sm rounded">14</a>
                    <a href="zf15.html" class="link-item p-2 text-center text-sm rounded">15</a>
                    <a href="zf16.html" class="link-item p-2 text-center text-sm rounded">16</a>
                    <a href="zf17.html" class="link-item p-2 text-center text-sm rounded">17</a>
                    <a href="zf18.html" class="link-item p-2 text-center text-sm rounded">18</a>
                    <a href="zf19.html" class="link-item p-2 text-center text-sm rounded">19</a>
                    <a href="zf20.html" class="link-item p-2 text-center text-sm rounded">20</a>
                    <a href="zf21.html" class="link-item p-2 text-center text-sm rounded">21</a>
                    <a href="zf22.html" class="link-item p-2 text-center text-sm rounded">22</a>
                    <a href="zf23.html" class="link-item p-2 text-center text-sm rounded">23</a>
                    <a href="zf24.html" class="link-item p-2 text-center text-sm rounded">24</a>
                    <a href="zf25.html" class="link-item p-2 text-center text-sm rounded">25</a>
                    <a href="zf26.html" class="link-item p-2 text-center text-sm rounded">26</a>
                    <a href="zf27.html" class="link-item p-2 text-center text-sm rounded">27</a>
                    <a href="zf28.html" class="link-item p-2 text-center text-sm rounded">28</a>
                    <a href="zf29.html" class="link-item p-2 text-center text-sm rounded">29</a>
                    <a href="zf30.html" class="link-item p-2 text-center text-sm rounded">30</a>
                </div>
                <div class="text-center">
                    <a href="../index.html" class="inline-block p-2 bg-[#8d7665] text-white text-sm rounded hover:bg-[#6b5445] transition">回到上级</a>
                </div>
            </div>
        </div>
        <!-- 右侧内容 -->
        <div class="flex-1 max-w-4xl">`;

const styleCSS = `        .link-module {
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #8d7665;
            border-radius: 8px;
        }
        .link-item {
            transition: all 0.3s ease;
        }
        .link-item:hover {
            background: #f4f1ea;
            transform: translateY(-2px);
        }
        .link-item.active {
            background: #8d7665;
            color: #f4f1ea;
        }`;

files.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 提取文件编号
    const match = file.match(/zf(\d+)\.html/);
    if (!match) return;
    const number = match[1];
    
    // 添加CSS样式
    if (!content.includes('.link-module')) {
        content = content.replace('    </style>', styleCSS + '\n    </style>');
    }
    
    // 替换body内容
    if (content.includes('<body class="p-4 md:p-8">\n    <div class="max-w-4xl mx-auto">')) {
        content = content.replace('<body class="p-4 md:p-8">\n    <div class="max-w-4xl mx-auto">', '<body class="p-4 md:p-8">\n    <div class="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">');
    }
    
    // 添加链接模块
    if (!content.includes('<!-- 左侧链接模块 -->')) {
        content = content.replace('<body class="p-4 md:p-8">\n    <div class="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">', '<body class="p-4 md:p-8">\n    <div class="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">\n' + linkModuleHTML);
    }
    
    // 设置当前文件为active
    const activePattern = new RegExp(`<a href="zf${number}\.html" class="link-item p-2`, 'g');
    content = content.replace(activePattern, `<a href="zf${number}\.html" class="link-item active p-2`);
    
    // 关闭右侧内容div
    if (!content.includes('        </div>\n    </div>\n</body>')) {
        content = content.replace('        </footer>\n    </div>\n</body>', '        </footer>\n        </div>\n    </div>\n</body>');
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});

console.log('All files updated successfully!');