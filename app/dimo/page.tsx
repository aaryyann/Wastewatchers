
import React from 'react';
import DimoEcoScore from '@/components/DimoEcoScore';
import DimoVehicleData from '@/components/DimoVehicleData';

export default function DimoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-black">DIMO Integration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DimoEcoScore />
        <DimoVehicleData />
      </div>
    </div>
  );
}
