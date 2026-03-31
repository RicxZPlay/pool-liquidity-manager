@echo off
chcp 65001 >nul
title Pool Liquidity Manager - Servidor de Desenvolvimento

echo.
echo =====================================================
echo          POOL LIQUIDITY MANAGER
echo     Iniciando servidor de desenvolvimento...
echo =====================================================
echo.
echo O navegador será aberto automaticamente em alguns segundos...
echo Aguarde...

:: Abre o navegador automaticamente (porta padrão do Vite)
start "" http://localhost:5173

:: Inicia o servidor
npm run dev

pause