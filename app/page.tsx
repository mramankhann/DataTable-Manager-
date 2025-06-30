import UserTable from '@/components/UserTable';

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Table</h1>
      <UserTable />
    </main>
  );
}
