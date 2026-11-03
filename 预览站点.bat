@echo off
title 陈工的世界 - 本地预览
cd /d "%~dp0"

echo ==========================================
echo    陈工的世界 · 本地预览
echo ==========================================
echo.
echo 项目目录: %CD%
echo.

set "PORT=8080"

rem ---------- 优先 Python ----------
where python >nul 2>nul
if %errorlevel%==0 goto :use_python

rem ---------- 其次 Node ----------
where node >nul 2>nul
if %errorlevel%==0 goto :use_node

goto :no_runtime


:use_python
echo [OK] 检测到 Python，正在启动本地服务器...
echo [URL] http://localhost:%PORT%/
echo.
echo 浏览器将在 2 秒后自动打开。
echo 关闭本窗口，或按 Ctrl+C，即可停止服务。
echo.
if defined NO_BROWSER goto :py_serve
start "" cmd /c "timeout /t 2 >nul && start http://localhost:%PORT%/"
:py_serve
python -m http.server %PORT% --bind 127.0.0.1
goto :end


:use_node
echo [OK] 未找到 Python，改用 Node 启动（首次运行会自动下载 serve，请稍等）...
echo [URL] http://localhost:%PORT%/
echo.
start "" cmd /c "timeout /t 4 >nul && start http://localhost:%PORT%/"
npx --yes serve -l %PORT% .
goto :end


:no_runtime
echo [X] 没有检测到 Python 或 Node。
echo.
echo     你依然可以预览：直接双击本目录下的 index.html，
echo     用浏览器打开即可（绝大多数功能正常）。
echo.
echo     如果需要完整的本地服务效果，请任选其一安装：
echo       - Python:  https://www.python.org/downloads/
echo       - Node.js: https://nodejs.org/
echo.
pause
goto :end


:end
echo.
echo 服务已停止。
pause
