param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
)

Set-Location $PSScriptRoot
docker compose up --build @Args
