# Get-AzureVMs.ps1 - sample
# Requires Az module and logged in via Connect-AzAccount
try {
    if (-not (Get-Module -ListAvailable -Name Az)) {
        Write-Host "Az module not found. Run: Install-Module Az -Scope CurrentUser"
    }
    # Connect-AzAccount  # Use service principal in CI
    Get-AzVM | Select-Object Name, ResourceGroupName, Location | Out-File -FilePath (Join-Path $PSScriptRoot 'vms-report.txt')
    Write-Host "VMs written to vms-report.txt"
} catch {
    Write-Error $_
}
