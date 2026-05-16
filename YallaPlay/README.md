# YallaPlay

YallaPlay is a React Native Expo app for booking sports fields and courts in the West Bank.

## Frontend

```bash
cd YallaPlay
npm install
npx expo start -c
```

## Backend

```bash
cd YallaPlay-Backend
npm install
npm run dev
```

## Notes

- Firebase is used for Authentication and profile data.
- Express backend is used for fields, search, field details, and bookings API.
- Update `services/api.ts` with your laptop IPv4 address before testing on a physical phone.
