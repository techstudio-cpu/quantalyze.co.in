import { notFound } from 'next/navigation';
import Link from 'next/link';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const numericId = Number.parseInt(id, 10);
  if (!Number.isFinite(numericId)) {
    notFound();
  }

  const rows = await query(
    `SELECT id, title, description, icon, category, price, show_price, featured, status, points, sub_services, created_at, updated_at
     FROM services
     WHERE id = ? AND deleted_at IS NULL`,
    [numericId]
  );

  const service = Array.isArray(rows) ? (rows as any[])[0] : null;

  if (!service || service.status !== 'active') {
    notFound();
  }

  const showPrice = service.show_price === undefined || service.show_price === null ? true : !!service.show_price;
  const points: string[] = Array.isArray(service.points)
    ? service.points
    : typeof service.points === 'string'
      ? (() => {
          try {
            const parsed = JSON.parse(service.points);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

  const subServices: Array<{ name: string; href: string; description: string }> = Array.isArray(service.sub_services)
    ? service.sub_services
    : typeof service.sub_services === 'string'
      ? (() => {
          try {
            const parsed = JSON.parse(service.sub_services);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
            <p className="text-gray-700 leading-relaxed">{service.description}</p>

            <div className="flex flex-wrap gap-3 mt-2">
              {service.category && (
                <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                  {service.category}
                </span>
              )}
              {showPrice && service.price !== null && service.price !== undefined && (
                <span className="text-sm px-3 py-1 rounded-full bg-yellow-100 text-yellow-900">
                  Price: ₹{Number(service.price).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {points.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Key points</h2>
              <ul className="space-y-2">
                {points.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-yellow-400 flex-shrink-0" />
                    <span className="text-gray-700">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {subServices.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Sub-services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subServices.map((s, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl bg-gray-50">
                    {s.href ? (
                      s.href.startsWith('http') ? (
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 hover:bg-gray-100 transition-colors rounded-xl"
                        >
                          <div className="font-semibold text-gray-900">{s.name}</div>
                          {s.description && <div className="text-sm text-gray-700 mt-1">{s.description}</div>}
                        </a>
                      ) : (
                        <Link
                          href={s.href}
                          className="block p-4 hover:bg-gray-100 transition-colors rounded-xl"
                        >
                          <div className="font-semibold text-gray-900">{s.name}</div>
                          {s.description && <div className="text-sm text-gray-700 mt-1">{s.description}</div>}
                        </Link>
                      )
                    ) : (
                      <div className="p-4">
                        <div className="font-semibold text-gray-900">{s.name}</div>
                        {s.description && <div className="text-sm text-gray-700 mt-1">{s.description}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
