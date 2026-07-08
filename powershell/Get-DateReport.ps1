# Get-DateReport.ps1 - sample report
$date = Get-Date
$date | Out-File (Join-Path $PSScriptRoot 'report.txt')
Write-Host "Report created: $(Get-Item (Join-Path $PSScriptRoot 'report.txt')).FullName"
