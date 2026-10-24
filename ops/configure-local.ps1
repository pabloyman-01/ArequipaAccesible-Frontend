param(
    [Parameter(Mandatory=$true)][string]$SupabaseUrl,
    [Parameter(Mandatory=$true)][string]$SupabasePublishableKey,
    [string]$ApiBaseUrl = '/api'
)
$ErrorActionPreference = 'Stop'
if (-not $SupabasePublishableKey.StartsWith('sb_publishable_')) { throw 'Use only a real Supabase publishable key, never a server secret.' }
if (-not $SupabaseUrl.StartsWith('https://')) { throw 'Supabase URL must use HTTPS.' }
$configPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'public/config.json'
$config = @{apiBaseUrl=$ApiBaseUrl;supabaseUrl=$SupabaseUrl;supabasePublishableKey=$SupabasePublishableKey} | ConvertTo-Json
[IO.File]::WriteAllText($configPath,$config,[Text.UTF8Encoding]::new($false))
Write-Output 'public/config.json configured with public settings only.'
