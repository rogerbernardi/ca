# Script: install_postgresbackup_as_a_service.ps1
# Função: Instalar o executável postgresBackup.exe como um serviço do windows
# Onde será usado: Servidor VM
# Autor: Roger Bernardi - 51 99945 7787
# Data: 21/11/2018
# nssm.exe - download from https://drive.google.com/open?id=1ocbQbpz43DxKAPKXwhMpP_ajKxqBezR0
# ps1_to_exe.exe - download from https://drive.google.com/open?id=1KHrsBfvDlc63WQeAkMftSorDV7mYU4xI

write-host Configurando o c:\postgresBackup\postgresBackup.exe como um serviço do Windows...
c:\postgresBackup\nssm.exe install postgresBackup c:\postgresBackup\postgresBackup.exe
c:\postgresBackup\nssm.exe start postgresBackup


