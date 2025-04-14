# Buscador de Universidades (React Native / Expo)

![React Native](https://img.shields.io/badge/React%20Native-Expo-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-Utilizado-purple?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-Usado-blue?logo=typescript)

Este aplicativo permite buscar informações sobre universidades por país e nome, utilizando React Native com Expo. Os dados são obtidos da API pública `universities.hipolabs.com`. Ele também permite salvar e remover universidades favoritas localmente.

## Tecnologias

-   React Native
-   Expo
-   TypeScript
-   AsyncStorage (para favoritos)
-   Expo Router (para navegação)

## Estrutura Principal

-   `app/_layout.tsx`: Define a navegação entre telas.
-   `app/index.tsx`: Tela principal de busca e resultados.
-   `app/favoritos.tsx`: Tela para listar e remover favoritos.
-   `app/+not-found.tsx`: Tela para páginas não encontradas.

## Funcionalidades

-   **Buscar:** Insira país e/ou nome da universidade para pesquisar.
-   **Listar Resultados:** Veja a lista de universidades encontradas.
-   **Salvar Favorito:** Clique em uma universidade na busca para salvá-la.
-   **Ver Favoritos:** Acesse a tela de favoritos para ver os itens salvos.
-   **Remover Favorito:** Clique no 'X' ao lado de um favorito para excluí-lo.

## Como Executar

1.  Clone este repositório:
    ```bash
    git clone https://github.com/henrique-sdc/app-busca-react-native.git
    ```
2.  Entre na pasta do projeto:
    ```bash
    cd app-busca-react-native
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
    *(ou `yarn install` se usar Yarn)*

4.  Inicie o aplicativo:
    ```bash
    npx expo start
    ```
5.  Siga as instruções no terminal para abrir no emulador/simulador ou no aplicativo Expo Go do seu celular.

## API Utilizada

-   [Universities API by Hipo](http://universities.hipolabs.com/): `http://universities.hipolabs.com/search?country={pais}&name={nome}`
