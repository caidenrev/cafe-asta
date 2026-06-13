# Dokumentasi Project: Cafe QR Ordering System (Warkop Asta)

Sistem Pemesanan Menu Berbasis QR Code untuk **Warkop Asta** menggunakan **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, dan **MySQL**.

---

## 1. Pendahuluan
**Warkop Asta** adalah aplikasi web pemesanan mandiri berbasis QR Code. Pelanggan cukup memindai kode QR yang berada di meja makan untuk membuka aplikasi, memilih menu makanan/minuman, menyesuaikan varian (suhu/harga), memasukkan ke keranjang belanja, mengisi catatan tambahan untuk dapur, dan melakukan pembayaran instan secara mandiri menggunakan QRIS. Setelah pembayaran diverifikasi, pesanan masuk ke dashboard admin dapur secara real-time untuk diproses dan disajikan.

---

## 2. Diagram Use Case (Use Case Diagram)
Diagram ini menjelaskan interaksi aktor utama (Pelanggan dan Staf Dapur/Admin) dengan sistem.

```plantuml
@startuml UseCaseDiagram
skinparam handwritten false
skinparam monochrome false
skinparam packageStyle rect
skinparam defaultFontName "Courier New"

actor "Pelanggan" as customer
actor "Staf Dapur / Admin" as admin

rectangle "Sistem QR Ordering Warkop Asta" {
  usecase "Pindai QR & Deteksi Meja" as UC_ScanQR
  usecase "Cari & Filter Menu Kuliner" as UC_BrowseMenu
  usecase "Pilih Menu & Varian (Panas/Dingin)" as UC_SelectVariant
  usecase "Kelola Keranjang Belanja" as UC_ManageCart
  usecase "Tulis Catatan Kustom untuk Dapur" as UC_AddNotes
  usecase "Bayar via QRIS (Verifikasi Otomatis)" as UC_PayQRIS
  usecase "Pantau Status Pesanan (Real-time)" as UC_TrackStatus
  
  usecase "Pantau Antrean Pesanan (Real-time Polling)" as UC_MonitorOrders
  usecase "Proses & Ubah Status Pesanan" as UC_UpdateStatus
  usecase "Lihat Ringkasan Statistik Penjualan" as UC_ViewStats
}

customer --> UC_ScanQR
customer --> UC_BrowseMenu
customer --> UC_SelectVariant
customer --> UC_ManageCart
customer --> UC_AddNotes
customer --> UC_PayQRIS
customer --> UC_TrackStatus

admin --> UC_MonitorOrders
admin --> UC_UpdateStatus
admin --> UC_ViewStats
@enduml
```

---

## 3. Diagram Alur Pengguna (User Flow Diagram)
Menunjukkan navigasi halaman dari sisi Pelanggan maupun Admin.

```plantuml
@startuml UserFlowDiagram
skinparam defaultFontName "Courier New"
title Alur Pengamanan & Navigasi Halaman

state "Halaman Menu (/)" as MenuPage : Menampilkan daftar menu,\nfilter kategori, & pencarian.
state "Modal Varian" as VariantModal : Memilih varian minuman\n(Panas / Dingin).
state "Halaman Keranjang (/cart)" as CartPage : Tinjau item, ubah jumlah,\ndan tulis catatan dapur.
state "Halaman Pembayaran (/checkout)" as CheckoutPage : Scan QRIS & masukkan/konfirmasi nomor meja.
state "Halaman Sukses (/success)" as SuccessPage : Menampilkan invoice & status pesanan.
state "Dashboard Admin (/admin)" as AdminPage : Dashboard real-time untuk memproses\ndan memantau antrean pesanan.

[*] --> MenuPage : Scan QR / Buka Web
MenuPage --> VariantModal : Klik "Pilih" (menu bervarian)
VariantModal --> MenuPage : Batal / Tambahkan varian ke keranjang
MenuPage --> CartPage : Klik "Lihat Keranjang" (Subtotal terapung)
CartPage --> MenuPage : Tambah menu lagi
CartPage --> CheckoutPage : Klik "Konfirmasi Pemesanan"
CheckoutPage --> SuccessPage : Kirim Transaksi & Pembayaran Berhasil

[*] --> AdminPage : Akses Dapur
AdminPage --> AdminPage : Polling pesanan masuk otomatis (setiap 4 detik)\ndan ubah status pesanan.
@enduml
```

---

## 4. Diagram Aktivitas (Activity Diagram)
Menjelaskan langkah logis alur transaksi pemesanan dari mulai memindai QR sampai pesanan disajikan.

```plantuml
@startuml ActivityDiagram
skinparam defaultFontName "Courier New"
|Pelanggan|
start
:Scan QR Code di meja makan;
:Sistem mendeteksi nomor meja secara otomatis;
:Cari dan filter menu kuliner;
if (Pilih item dengan varian?) then (ya)
  :Pilih varian (Panas/Dingin);
else (tidak)
endif
:Tambahkan ke keranjang belanja;
:Tinjau keranjang & isi catatan tambahan;
:Klik Konfirmasi Pemesanan;
:Scan kode QRIS & konfirmasi nomor meja;
:Klik Konfirmasi Pembayaran Berhasil;

|Next.js Backend|
:Menerima payload pemesanan;
:Mulai database transaction;
:Insert data ke table 'orders';
:Insert item ke table 'order_items';
:Commit transaction;
:Kembalikan HTTP 201 dengan Order ID (ORD-XXXX);

|Pelanggan|
:Arahkan ke Halaman Sukses;
:Poling status pesanan secara berkala;

|Staf Dapur / Admin|
:Sistem admin mendeteksi pesanan baru (Status: Pending);
:Mulai memproses makanan/minuman;
:Ubah status pesanan ke 'Processing' (Disiapkan);
:Selesai membuat hidangan;
:Antar pesanan ke meja tujuan;
:Ubah status pesanan ke 'Completed' (Selesai);

|Pelanggan|
:Menerima update status pesanan selesai;
:Nikmati hidangan;
stop
@enduml
```

---

## 5. Diagram Sekuens (Sequence Diagram)
Menunjukkan pertukaran pesan antar komponen web selama proses pemesanan dan pemrosesan pesanan.

```plantuml
@startuml SequenceDiagram
skinparam defaultFontName "Courier New"
autonumber

actor "Pelanggan" as User
boundary "Halaman Menu/Cart" as ClientUI
boundary "Halaman Checkout & Success" as CheckoutUI
control "API Orders (/api/orders)" as APIOrders
database "MySQL Database" as DB
actor "Staf Dapur (Admin)" as Admin
boundary "Dashboard Admin (/admin)" as AdminUI

== Tahap Pemilihan & Masuk Keranjang ==
User -> ClientUI: Pilih menu & tentukan varian/jumlah
ClientUI -> ClientUI: Simpan state keranjang ke LocalStorage

== Tahap Checkout ==
User -> ClientUI: Navigasi ke keranjang & klik checkout
ClientUI -> CheckoutUI: Tampilkan QRIS & form nomor meja
User -> CheckoutUI: Lakukan pembayaran QRIS & klik konfirmasi
CheckoutUI -> APIOrders: HTTP POST /api/orders (tableNumber, items, total)

activate APIOrders
APIOrders -> DB: START TRANSACTION
APIOrders -> DB: INSERT INTO orders (id, table_number, total_amount, status)
APIOrders -> DB: INSERT INTO order_items (order_id, menu_item_id, menu_item_name, price, qty)
APIOrders -> DB: COMMIT TRANSACTION
DB --> APIOrders: Status transaksi sukses
APIOrders --> CheckoutUI: HTTP 201 (Order Created: ORD-XXXX)
deactivate APIOrders

CheckoutUI -> CheckoutUI: Bersihkan LocalStorage cart
CheckoutUI -> User: Arahkan ke /success?id=ORD-XXXX
loop Polling Status Pesanan (etiap 5 detik)
  CheckoutUI -> APIOrders: HTTP GET /api/orders/ORD-XXXX
  APIOrders -> DB: SELECT * FROM orders WHERE id = ORD-XXXX
  DB --> APIOrders: Data status terbaru
  APIOrders --> CheckoutUI: Status pesanan (misal: "Pending")
end

== Tahap Pemrosesan Dapur (Admin) ==
loop Polling Pesanan Baru (setiap 4 detik)
  AdminUI -> APIOrders: HTTP GET /api/orders
  APIOrders -> DB: SELECT * FROM orders & order_items
  DB --> APIOrders: List semua pesanan
  APIOrders --> AdminUI: Data JSON semua pesanan
  AdminUI -> AdminUI: Perbarui UI antrean & statistik pendapatan
end

Admin -> AdminUI: Klik "Proses Pesanan" (Ubah ke Disiapkan)
AdminUI -> APIOrders: HTTP PATCH /api/orders/ORD-XXXX (status: "Processing")
APIOrders -> DB: UPDATE orders SET status = 'Processing' WHERE id = ORD-XXXX
DB --> APIOrders: Row updated
APIOrders --> AdminUI: HTTP 200 OK

Admin -> AdminUI: Antar hidangan ke meja & klik "Antar/Selesai"
AdminUI -> APIOrders: HTTP PATCH /api/orders/ORD-XXXX (status: "Completed")
APIOrders -> DB: UPDATE orders SET status = 'Completed' WHERE id = ORD-XXXX
DB --> APIOrders: Row updated
APIOrders --> AdminUI: HTTP 200 OK

@enduml
```

---

## 6. Diagram Kelas (Class Diagram)
Representasi struktur objek data (model) pada client-side (Next.js/React Context) dan backend server.

```plantuml
@startuml ClassDiagram
skinparam defaultFontName "Courier New"

package "Client-Side Types" {
  interface MenuItem {
    + id: string
    + name: string
    + price: number
    + category: 'coffee' | 'non-coffee' | 'main-course' | 'snack' | 'refresher'
    + description: string
    + image: string
    + variants: Variant[]
  }

  interface Variant {
    + name: string
    + price: number
  }

  interface CartItem {
    + menuItem: MenuItem
    + selectedVariant: Variant
    + quantity: number
  }

  interface CartContextType {
    + cart: CartItem[]
    + tableNumber: string
    + cartTotal: number
    + cartCount: number
    + addToCart(item: MenuItem, variant: Variant)
    + removeFromCart(itemId: string, variantName: string)
    + updateQuantity(itemId: string, variantName: string, quantity: number)
    + clearCart()
    + setTableNumber(table: string)
  }

  interface OrderClient {
    + id: string
    + tableNumber: string
    + items: OrderItemClient[]
    + total: number
    + status: 'Pending' | 'Processing' | 'Completed'
    + createdAt: string
  }

  interface OrderItemClient {
    + menuItem: MenuItem
    + quantity: number
  }
}

package "Backend / Database Schema" {
  class orders {
    + id: varchar(50) <<PK>>
    + table_number: varchar(10)
    + total_amount: decimal(10,2)
    + status: varchar(20)
    + created_at: timestamp
  }

  class order_items {
    + id: int <<PK>> <<AI>>
    + order_id: varchar(50) <<FK>>
    + menu_item_id: varchar(50)
    + menu_item_name: varchar(100)
    + menu_item_price: decimal(10,2)
    + menu_item_image: varchar(255)
    + quantity: int
  }
}

MenuItem "1" *-- "0..*" Variant
CartItem "1" *-- "1" MenuItem
CartItem "1" o-- "0..1" Variant
CartContextType "1" *-- "0..*" CartItem
OrderClient "1" *-- "0..*" OrderItemClient

orders "1" -- "0..*" order_items : "has items"
@enduml
```

---

## 7. Diagram Arsitektur (Architecture Diagram)
Diagram arsitektur sistem modular yang digunakan dalam project Next.js.

```plantuml
@startuml ArchitectureDiagram
skinparam defaultFontName "Courier New"

package "Client Layer (Frontend)" {
  component "Next.js Pages (Client Components)" as clientPages {
    [Halaman Menu (/)] as pageMenu
    [Halaman Keranjang (/cart)] as pageCart
    [Halaman Checkout (/checkout)] as pageCheckout
    [Halaman Sukses (/success)] as pageSuccess
    [Dashboard Admin (/admin)] as pageAdmin
  }
  
  component "State Management" as stateMgmt {
    [CartContext (React Context API)] as cartCtx
    [LocalStorage Web API] as localStorage
  }
  
  component "UI Components" as uiComp {
    [MobileFrame Layout] as mobFrame
    [StatusBadge] as badge
  }
}

package "Server Layer (Backend API)" {
  component "Next.js API Router (Serverless / Server-Side)" as serverAPI {
    [POST & GET /api/orders] as routeOrders
    [PATCH & GET /api/orders/[id]] as routeOrdersDetail
  }
  
  component "Database Connection & Migrations" as dbHelper {
    [lib/db.ts (initDb & executeQuery)] as dbConnect
  }
}

database "MySQL Database Service" as dbMySQL {
  folder "Database Tables" {
    [Table: orders] as tblOrders
    [Table: order_items] as tblOrderItems
  }
}

' Hubungan Client
pageMenu --> cartCtx
pageCart --> cartCtx
pageCheckout --> cartCtx
cartCtx <-> localStorage : "Persist Cart State"

pageMenu --|> mobFrame
pageCart --|> mobFrame
pageCheckout --|> mobFrame
pageSuccess --|> mobFrame
pageAdmin --|> badge

' Hubungan Client ke Server API via Fetch
pageCheckout --> routeOrders : "HTTP POST"
pageSuccess --> routeOrdersDetail : "HTTP GET (Polling status)"
pageAdmin --> routeOrders : "HTTP GET (Polling list)"
pageAdmin --> routeOrdersDetail : "HTTP PATCH (Update status)"

' Hubungan Server API ke Database
routeOrders --> dbConnect : "Query Exec"
routeOrdersDetail --> dbConnect : "Query Exec"
dbConnect --> tblOrders : SQL Queries
dbConnect --> tblOrderItems : SQL Queries

@enduml
```

---

## 8. Entity Relationship Diagram (ERD)
Hubungan database fisik antara tabel `orders` dan `order_items` beserta tipe data dan key constraints.

```plantuml
@startuml ERD
skinparam defaultFontName "Courier New"
left to right direction

entity "orders" {
  * id : VARCHAR(50) <<PK>>
  --
  * table_number : VARCHAR(10)
  * total_amount : DECIMAL(10,2)
  * status : VARCHAR(20) [Default: 'Pending']
  * created_at : TIMESTAMP [Default: CURRENT_TIMESTAMP]
}

entity "order_items" {
  * id : INT AUTO_INCREMENT <<PK>>
  --
  * order_id : VARCHAR(50) <<FK>>
  * menu_item_id : VARCHAR(50)
  * menu_item_name : VARCHAR(100)
  * menu_item_price : DECIMAL(10,2)
  * menu_item_image : VARCHAR(255)
  * quantity : INT
}

orders ||--o{ order_items : "FK: order_id references orders.id (ON DELETE CASCADE)"
@enduml
```

---

## 9. Struktur Folder Project
Berikut adalah penjelasan singkat struktur berkas project:

*   `/app`: Routing utama Next.js (App Router).
    *   `/app/page.tsx`: Halaman katalog menu pelanggan.
    *   `/app/cart/page.tsx`: Halaman keranjang belanja pelanggan.
    *   `/app/checkout/page.tsx`: Halaman scan QRIS dan konfirmasi nomor meja.
    *   `/app/success/page.tsx`: Halaman status penyelesaian pesanan & invoice.
    *   `/app/admin/page.tsx`: Panel dashboard real-time dapur dan statistik staf.
    *   `/app/api/orders`: Endpoint API untuk mengambil dan membuat pesanan.
    *   `/app/api/orders/[id]`: Endpoint API untuk mengambil detail dan mengubah status pesanan.
*   `/components`: Komponen UI reusable seperti `MobileFrame` dan `StatusBadge`.
*   `/context`: `CartContext.tsx` untuk mengelola state belanjaan pelanggan di sisi klien.
*   `/data`: `menu.ts` yang menyimpan database katalog makanan dan minuman statis.
*   `/lib`: `db.ts` yang berisi inisialisasi pool koneksi MySQL dan skema migrasi otomatis.
*   `.env.local` / `.env.production`: Konfigurasi variabel lingkungan untuk koneksi database MySQL.
