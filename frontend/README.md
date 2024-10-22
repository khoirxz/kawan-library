# KAWAN LIBRARY FRONTEND

aplikasi yang berfungsi sebagai library frontend dari pt. bpr kawan

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Deploy](#deploy)

## Install

Untuk proses instalasi, silahkan clone pada repositori ini kemudian lakukan installasi dengan menggunakan perintah berikut :

```bash
npm install
```

## Usage

Jika ingin memulai aplikasi, silahkan jalankan perintah berikut :

```bash
npm start
```

## Deploy

Deploy aplikasi pada cloud hosting dengan menggunakan perintah berikut :

```bash
npm run deploy
```

catatan : pengguna hosting/cpanel harus mengganti base url pada react-router-dom dan homepage package.json.

contoh pada package.json :

```json
"homepage": "https://bprkawan.co.id/library/"
```

contoh pada react-router-dom :

```jsx
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
  ],
  {
    basename: "https://bprkawan.co.id/library/",
  }
);
```

pada konfigurasi tersebut saya menggunakan createBrowserRouter yang tersedia pada react-router-dom v6^, anda bisa sesuaikan dengan versi yang anda gunakan.
