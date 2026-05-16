# YallaPlay Project Requirements Checklist

| Requirement | Where it is used |
|---|---|
| Github | Project ready to upload as `YallaPlay` and `YallaPlay-Backend` folders |
| react-hook-form | `app/edit-profile.tsx` |
| TanStack React Query | `hooks/useFields.ts`, `app/field/[id].tsx`, Home/Search screens |
| Device feature | Location in `hooks/useDeviceLocation.ts` and Home screen |
| UI/UX | Home, Search, Details, Booking, Payment, My Bookings, Profile |
| SQLite | `hooks/useOfflineBookings.ts` and My Bookings offline section |
| Test case | `__tests__/SportChip.test.tsx` |
| Axios | `services/api.ts` and API service files |
| File structure | `components`, `hooks`, `services`, `utils`, `context`, `types`, backend routes/data |
| Clean code | Reusable hooks, services, utils, separated backend routes |
| Custom hooks | `useFields`, `useUser`, `useDeviceLocation`, `useOfflineBookings` |
| Context API | `context/AppContext.tsx` |
| Async Storage | Favorite sport and favorite fields in `AppContext` |
| Error handling | Login validation, API retry states, backend validation responses |
| useCallback / useMemo / useRef | Home, Booking, Profile, Login animations, hooks |
| Authentication secure store | `utils/secureAuth.ts` used after Firebase login/logout |

Firebase is used for Authentication and user profile storage. Express is used as a dummy backend for fields, search, details, profile routes, and bookings API.
