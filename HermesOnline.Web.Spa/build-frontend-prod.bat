@echo off

rmdir dist /s /q
cd Frontend

call npm install
call npm run build-prod
if ERRORLEVEL 1 goto ERROR_BUILD

cd dist
move /Y "index.html" "..\..\index.html" 
if ERRORLEVEL 1 goto ERROR_COPY_INDEX

cd ..

xcopy "dist" "..\dist"  /i /s /y
if ERRORLEVEL 1 goto ERROR_COPY_DIST
rmdir "dist" /S /Q

cd ..

xcopy "dist\assets" "assets"  /i /s /y
if ERRORLEVEL 1 goto ERROR_COPY_ASSETS
rmdir "dist\assets" /S /Q

goto SUCCESS

:SUCCESS
echo Frontend is successfully built!
exit /B 0

:ERROR_BUILD
echo Failed to build!
exit /B 1

:ERROR_COPY_INDEX
echo Failed to move index.html!
exit /B 1

:ERROR_COPY_DIST
echo Failed to move dist folder!
exit /B 1

:ERROR_COPY_ASSETS
echo Failed to copy assets folder!
exit /B 1


