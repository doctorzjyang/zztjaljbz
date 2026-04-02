#!/usr/bin/env powershell

# 快速启动脚本 - 资治通鉴网页系统
# 支持单个项目和批量处理

function Start-LocalServer {
    param(
        [string]$Directory = "."
    )
    
    Write-Host "正在启动本地服务器..." -ForegroundColor Green
    Write-Host "服务器目录: $Directory" -ForegroundColor Cyan
    
    # 检查Python是否安装
    if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Host "错误: 未找到Python，请先安装Python 3.6+" -ForegroundColor Red
        return
    }
    
    # 启动Python HTTP服务器
    try {
        Write-Host "启动Python HTTP服务器在端口 8000..." -ForegroundColor Yellow
        Write-Host "访问地址: http://localhost:8000" -ForegroundColor Green
        Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
        
        python -m http.server 8000 -d $Directory
    }
    catch {
        Write-Host "启动服务器失败: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Process-Project {
    param(
        [string]$ProjectPath
    )
    
    Write-Host "处理项目: $ProjectPath" -ForegroundColor Cyan
    
    # 检查项目目录是否存在
    if (-not (Test-Path $ProjectPath)) {
        Write-Host "错误: 项目目录不存在" -ForegroundColor Red
        return
    }
    
    # 检查是否有index.html文件
    $indexPath = Join-Path $ProjectPath "index.html"
    if (Test-Path $indexPath) {
        Write-Host "发现index.html文件，准备启动服务器..." -ForegroundColor Green
        Start-LocalServer -Directory $ProjectPath
    }
    else {
        Write-Host "错误: 项目目录中未找到index.html文件" -ForegroundColor Red
    }
}

function Process-AllProjects {
    param(
        [string]$BasePath = "."
    )
    
    Write-Host "批量处理所有项目..." -ForegroundColor Cyan
    
    # 查找所有包含index.html的子目录
    $projects = Get-ChildItem -Path $BasePath -Recurse -Directory | 
                Where-Object { Test-Path (Join-Path $_.FullName "index.html") }
    
    if ($projects.Count -eq 0) {
        Write-Host "未找到任何项目" -ForegroundColor Red
        return
    }
    
    Write-Host "找到 $($projects.Count) 个项目:" -ForegroundColor Green
    $projects | ForEach-Object {
        Write-Host "- $($_.FullName)" -ForegroundColor Yellow
    }
    
    # 启动主目录服务器
    Write-Host "启动主目录服务器..." -ForegroundColor Green
    Start-LocalServer -Directory $BasePath
}

# 主菜单
function Show-Menu {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "    资治通鉴网页系统 - 快速启动脚本    " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "1. 启动主目录服务器" -ForegroundColor Yellow
    Write-Host "2. 启动指定项目服务器" -ForegroundColor Yellow
    Write-Host "3. 批量处理所有项目" -ForegroundColor Yellow
    Write-Host "4. 退出" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
}

# 主循环
while ($true) {
    Show-Menu
    $choice = Read-Host "请选择操作 (1-4)"
    
    switch ($choice) {
        "1" {
            Start-LocalServer -Directory "."
        }
        "2" {
            $projectPath = Read-Host "请输入项目路径 (例如: zztj\吴起治军)"
            Process-Project -ProjectPath $projectPath
        }
        "3" {
            Process-AllProjects -BasePath "."
        }
        "4" {
            Write-Host "退出脚本..." -ForegroundColor Green
            break
        }
        default {
            Write-Host "无效选择，请重新输入" -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }
}