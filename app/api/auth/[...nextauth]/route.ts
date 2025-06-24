// Filename: app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/auth" // Mengimpor 'handlers' dari file auth.ts di root

// Mengekspor handler untuk metode GET dan POST
export const { GET, POST } = handlers