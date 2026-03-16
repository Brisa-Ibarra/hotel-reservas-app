# Hotel Reservas App

Sistema de gestión de reservas de hotel desarrollado con arquitectura limpia y TDD.

## Stack

- **Dominio:** TypeScript
- **Backend:** Express
- **Base de datos:** SQLite
- **Tests:** Vitest
- **Frontend:** Next.js + React (próximamente)

## Reflexión

### ¿Cómo te ayudó la arquitectura limpia y TDD?
- Cuando tuve que cambiar de guardar los datos en memoria a SQLite, no tuve que tocar nada en los casos de usos y el dominio.
- Los test me ayudaron mucho a detectar errores antes de levantar el servidor, por ejemplo tuve un error de tipeo de .reject vs .rejects

### ¿Qué parte te resultó más difícil?
- Configurar yarn en typescript era algo nuevo para mi fue muy complicado, saltaban errores que se encontraban los tipos pero los test corrían igual
- Entender la diferencia entre las interfaces del dominio y las implementaciones del backend, tuve que ver videos y documentación para poder entenderlo

### ¿Hubo algo que no habías pensado al principio?
- El problema de las fechas solapadas en las reservas requería mas lógica de lo que se esperaba
- El orden de las rutas en Express importa, con este proyecto aprendí que una ruta /my/:userId tiene que ir antes que /

### ¿Qué aprendiste?
- Ahora entendí que si mañana quiero cambiar SQLite por PostgreSQL, solo tendría que cambiar los repositorios, sin tocar nada del dominio
- También aprendí que el dominio es lo mas importante, lo que es Express y SQLite son solamente detalles
- Me di cuenta que los tests me forzaron a pensar en casos que no había considerado, como qué pasa si la habitación está en mantenimiento o si las fechas se solapan
- Al principio me parecía que era más trabajo escribir el test antes del código, pero después me di cuenta que me ahorraba tiempo porque encontraba los errores más rápido