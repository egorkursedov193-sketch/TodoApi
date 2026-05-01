FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Переходим в папку, где лежит csproj файл
COPY TodoApi/TodoApi.csproj TodoApi/
RUN dotnet restore TodoApi/TodoApi.csproj

# Копируем весь код
COPY . .
RUN dotnet publish TodoApi/TodoApi.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:10000

ENTRYPOINT ["dotnet", "TodoApi.dll"]
