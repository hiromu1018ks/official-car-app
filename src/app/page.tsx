import { reserveVehicleAction } from "@/lib/actions/reservation-action.ts";
import { getVehicles, getVehicleStats } from "@/lib/data.ts";
import { HomeContent } from "./components/HomeContent.tsx";
import { VehicleTable } from "./components/VehicleTable.tsx";

export default async function Home() {
  const [stats, vehicles] = await Promise.all([
    getVehicleStats(),
    getVehicles(),
  ]);

  const { total, available, inUse, maintenance } = stats;

  return (
    <>
      <HomeContent
        total={total}
        available={available}
        inUse={inUse}
        maintenance={maintenance}
        vehicles={vehicles}
        onReservationSubmit={reserveVehicleAction}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <VehicleTable /> {/* ← ここに移動 */}
      </main>
    </>
  );
}
