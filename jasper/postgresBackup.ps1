# Script: postgresBackup.ps1
# Função: Realizar o backup do servidor postgreSql que armazena a base de dados do jasper reports.
# Onde será usado: Ambiente de desenvolvimento - VM Roger
# Autor: Roger Bernardi - 51 99945 7787
# Data: 21/11/2018
$backupfldr="c:\postgresBackup\"
$emailbody="c:\postgresBackup\emailbody.txt"
$hostname=(hostname)
$retaindays=30
$mailFrom = "backup@google.com"
$mailTo = "usuario@google.com"
$mailSubject = "Backup - PostgreSql Jasper Reports - "+ $hostname
$mailServer = "127.0.0.1"
$mailPort = 25
$mailUser = "backup"
$mailPassword = "backup"
New-Item -Force -ItemType directory -Path $backupfldr 2>$null
c:
cd $backupfldr
cls


# Executando o backup
function backup {
        pg_dump.exe -U postgres jasperserver > $backupfldr$timestamp.sql 2>$null
        zip.exe $backupfldr$timestamp.zip $backupfldr$timestamp.sql 2>$null
        del $backupfldr$timestamp.sql 2>$null
        # Rotate dos arquivos - Elimina caso arquivos tenham mais de $retaindays Dias.
        if ((Forfiles -p $backupfldr -s -m *.*).Count -gt $retaindays) {
                if ((Forfiles -p $backupfldr -s -m *.* -d $retaindays).Count -gt 5) {
                        # write-host Maior que $retaindays
                        write-host "Deletando arquivos zip mais velhos que $retaindays dias..."
                        Forfiles -p $backupfldr -s -m *.* -d $retaindays -c "cmd /c del /q @path"
                }
        }
        write-host $timestamp >> $emailbody 2>$null
        Clear-Content $emailbody 2>$null
        cls
        write-host $mailSubject
        (Get-Date).DateTime
        write-host $timestamp >> $emailbody
        write-host "Servidor: " + $hostname >> $emailbody
        write-host "Arquivo gerado no backup: " (dir $backupfldr$timestamp.zip)  >> $emailbody
        write-host "Arquivos de backup dentro da pasta: " (dir $backupfldr)  >> $emailbody
}

function send_email {
        $EmailFrom = $mailFrom
        $EmailTo = $mailTo
        $EmailSubject = $mailSubject + "  " + $timestamp
        write-host $EmailSubject
        $SMTPServer = $mailServer
        $SMTPAuthUsername = $mailUser
        $SMTPAuthPassword = $mailPassword
        $emailattachment = $emailbody
        $mailmessage = New-Object system.net.mail.mailmessage
        $mailmessage.from = ($emailfrom)
        $mailmessage.To.add($emailto)
        $mailmessage.Subject = $emailsubject
        $mailmessage.Body = $EmailSubject
        $attachment = New-Object System.Net.Mail.Attachment($emailattachment, 'text/plain')
        $mailmessage.Attachments.Add($attachment)
        # $mailmessage.IsBodyHTML = $true
        $SMTPClient = New-Object Net.Mail.SmtpClient($SmtpServer, $mailport)
        $SMTPClient.Credentials = New-Object System.Net.NetworkCredential("$SMTPAuthUsername", "$SMTPAuthPassword")
        $SMTPClient.Send($mailmessage)
}

function loop{
        backup
        send_email
}

while ($true) {
        $timestamp=Get-Date -Format g | foreach {$_ -replace ":", "h"} | foreach {$_ -replace " ", "_"} | foreach {$_ -replace "/", "-"}
        loop
        sleep 86400
}
