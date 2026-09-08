import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding data dummy...');

  await prisma.mutation.deleteMany();
  await prisma.inventoryLevel.deleteMany();
  await prisma.location.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('asdqwe123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Ardhani Ahlan',
      email: 'admin@wms.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin dibuat: admin@wms.com / asdqwe123');

  const whJakarta = await prisma.warehouse.create({
    data: { code: "WH-JKT-01", name: 'Gudang Pusat Jakarta', address: 'Jakarta Timur' },
  });
  const whBekasi = await prisma.warehouse.create({
    data: { code: "WH-BKS-02", name: 'Gudang Cabang Bekasi', address: 'Bekasi Barat' },
  });

  const rackA1 = await prisma.location.create({
    data: { code: 'JKT-A1-01', warehouseId: whJakarta.id },
  });
  const rackA2 = await prisma.location.create({
    data: { code: 'JKT-A1-02', warehouseId: whJakarta.id },
  });
  const rackB1 = await prisma.location.create({
    data: { code: 'BKS-B1-01', warehouseId: whBekasi.id },
  });
  const rackB2 = await prisma.location.create({
    data: { code: 'BKS-B1-02', warehouseId: whBekasi.id },
  });
  console.log('✅ Gudang dan Rak berhasil dibuat');

  const itemsData = [
    { name: 'MacBook Pro M3 14 inch', sku: 'LAP-MBP-M3', category: 'Elektronik', baseUnit: 'Pcs' },
    { name: 'Logitech MX Master 3S Mouse', sku: 'ACC-LOG-MX3', category: 'Aksesoris', baseUnit: 'Pcs' },
    { name: 'Dell UltraSharp 27 4K Monitor', sku: 'MON-DEL-274K', category: 'Elektronik', baseUnit: 'Pcs' },
    { name: 'Kursi Ergonomis Kantor Chairman', sku: 'FUR-CHR-ERG', category: 'Furnitur', baseUnit: 'Unit' },
    { name: 'Meja Standing Desk Elektrik', sku: 'FUR-STD-ELK', category: 'Furnitur', baseUnit: 'Unit' },
    { name: 'Mechanical Keyboard Keychron K2', sku: 'ACC-KEY-K2', category: 'Aksesoris', baseUnit: 'Pcs' },
    { name: 'Printer Epson L3210 All-in-One', sku: 'PRN-EPS-3210', category: 'Periferal', baseUnit: 'Unit' },
    { name: 'Kabel HDMI 2.1 Braided 2 Meter', sku: 'CBL-HDM-2M', category: 'Kabel', baseUnit: 'Pcs' },
  ];

  const createdItems = [];
  for (const item of itemsData) {
    const newItem = await prisma.item.create({ data: item });
    createdItems.push(newItem);
  }
  console.log('✅ 8 Barang sampel berhasil dibuat');

  await prisma.inventoryLevel.create({
    data: { itemId: createdItems[0].id, locationId: rackA1.id, quantity: 15 },
  });
  await prisma.mutation.create({
    data: {
      type: 'IN',
      itemId: createdItems[0].id,
      locationId: rackA1.id,
      quantity: 15,
      userId: adminUser.id,
      referenceDoc: 'Stok awal pengadaan Q3',
    },
  });

  await prisma.inventoryLevel.create({
    data: { itemId: createdItems[1].id, locationId: rackA1.id, quantity: 4 },
  });
  await prisma.inventoryLevel.create({
    data: { itemId: createdItems[1].id, locationId: rackB1.id, quantity: 6 },
  });
  await prisma.mutation.create({
    data: { type: 'IN', itemId: createdItems[1].id, locationId: rackA1.id, quantity: 4, userId: adminUser.id, referenceDoc: 'Restock mingguan' },
  });

  await prisma.inventoryLevel.create({
    data: { itemId: createdItems[2].id, locationId: rackB1.id, quantity: 12 },
  });
  await prisma.mutation.create({
    data: { type: 'IN', itemId: createdItems[2].id, locationId: rackB1.id, quantity: 12, userId: adminUser.id, referenceDoc: 'Pembelian unit baru kantor cabang' },
  });

  await prisma.inventoryLevel.create({
    data: { itemId: createdItems[3].id, locationId: rackA2.id, quantity: 0 },
  });

  await prisma.inventoryLevel.create({
    data: { itemId: createdItems[4].id, locationId: rackA2.id, quantity: 8 },
  });

  await prisma.inventoryLevel.create({
    data: { itemId: createdItems[5].id, locationId: rackB2.id, quantity: 20 },
  });

  console.log('✅ Inventori stok dan mutasi awal berhasil di-generate!');
  console.log('🚀 Seeding selesai! Silakan jalankan ulang aplikasi backend Anda.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });