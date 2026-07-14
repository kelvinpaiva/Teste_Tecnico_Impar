FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY CarSalesCrm.slnx ./
COPY src/CarSalesCrm.Domain/CarSalesCrm.Domain.csproj src/CarSalesCrm.Domain/
COPY src/CarSalesCrm.Application/CarSalesCrm.Application.csproj src/CarSalesCrm.Application/
COPY src/CarSalesCrm.Infrastructure/CarSalesCrm.Infrastructure.csproj src/CarSalesCrm.Infrastructure/
COPY src/CarSalesCrm.Api/CarSalesCrm.Api.csproj src/CarSalesCrm.Api/

RUN dotnet restore src/CarSalesCrm.Api/CarSalesCrm.Api.csproj

COPY src/ ./src/
RUN dotnet publish src/CarSalesCrm.Api/CarSalesCrm.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CarSalesCrm.Api.dll"]
