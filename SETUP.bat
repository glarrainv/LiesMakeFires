@echo off
setlocal EnableExtensions

REM ============================================================
REM  LiesMakeFires - one-time environment setup
REM
REM  Recreates the three gitignored artifact folders:
REM    .\models  - the all-MiniLM-L6-v2 ONNX model (from HF)
REM    .\dist_   - the transformers.js build (from npm)
REM    .\wasm    - the ONNX Runtime WASM backend (from npm)
REM ============================================================

REM Anchor all relative paths to this script's folder.
pushd "%~dp0"

set "MODEL_ID=onnx-community/all-MiniLM-L6-v2-ONNX"
set "MODEL_DIR=models\onnx-community\all-MiniLM-L6-v2-ONNX"

echo.
echo [1/5] Installing huggingface_hub (Python)...
pip install -U huggingface_hub || goto :fail

echo.
echo [2/5] Installing @huggingface/transformers (npm)...
call npm install @huggingface/transformers || goto :fail

echo.
echo [3/5] Downloading %MODEL_ID% into %MODEL_DIR% ...
hf download %MODEL_ID% --local-dir "%MODEL_DIR%" || goto :fail

REM --- locate the freshly installed packages ------------------
REM onnxruntime-web ships nested under transformers; fall back to
REM the top level in case npm hoisted it.
set "TRANSFORMERS_DIST=node_modules\@huggingface\transformers\dist"
set "ORT_DIST=node_modules\@huggingface\transformers\node_modules\onnxruntime-web\dist"
if not exist "%ORT_DIST%" set "ORT_DIST=node_modules\onnxruntime-web\dist"

echo.
echo [4/5] Copying transformers.js build into .\dist_ ...
if not exist "dist_" mkdir "dist_"
xcopy /Y /I "%TRANSFORMERS_DIST%\transformers.*" "dist_\" || goto :fail

echo.
echo [5/5] Copying ONNX Runtime WASM backend into .\wasm ...
if not exist "wasm" mkdir "wasm"
xcopy /Y /I "%ORT_DIST%\*" "wasm\" || goto :fail

echo.
echo Setup complete.
popd
endlocal
exit /b 0

:fail
echo.
echo Setup FAILED (errorlevel %errorlevel%). See messages above.
popd
endlocal
exit /b 1
