import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/organisms/Sidebar';
import SearchBar from '@/components/molecules/SearchBar'; 
import InternshipCard from '@/components/molecules/InternshipCard';

const dummyInternships = [
  {
    id: 1,
    tags: ['Hybrid', 'Unpaid Internship'],
    companyName: 'PT Tech Nusantara',
    companyInitial: 'PTN',
    position: 'Data Analyst',
    location: 'Jakarta Selatan',
    duration: '3 - 6 Bulan',
    deadline: '12 Okt'
  },
  {
    id: 2,
    tags: ['WFH', 'Paid Internship'],
    companyName: 'Agri Indo Group',
    companyInitial: 'AIG',
    position: 'Agronomy Researcher',
    location: 'Jakarta Selatan',
    duration: '3 - 6 Bulan',
    deadline: '12 Okt'
  },
  {
    id: 3,
    tags: ['WFO', 'Unpaid Internship'],
    companyName: 'Bank Sejahtera Bersama',
    companyInitial: 'BSB',
    position: 'Digital Marketing',
    location: 'Jakarta Selatan',
    duration: '3 - 6 Bulan',
    deadline: '12 Okt'
  },
  {
    id: 4,
    tags: ['Hybrid', 'Unpaid Internship'],
    companyName: 'PT Tech Nusantara',
    companyInitial: 'PTN',
    position: 'UI/UX Designer',
    location: 'Jakarta Selatan',
    duration: '3 - 6 Bulan',
    deadline: '12 Okt'
  }
];

function CariLowongan() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = dummyInternships.filter(item =>
    item.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-screen ml-[calc(50%-50vw)] overflow-x-hidden bg-[#F3F4FF]">
      <div className="flex w-full h-screen">
        <div className="hidden md:block w-64 shrink-0 bg-[#F8F9FE] border-r border-gray-200 h-full">
          <Sidebar activeMenu="Lowongan Magang" />
        </div>
        <div className="flex-1 h-full overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Cari Lowongan Magang</h1>
          <div className="mb-6 w-full">
            <SearchBar 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Deskripsi search" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((item) => (
              <InternshipCard
                key={item.id}
                tags={item.tags}
                companyName={item.companyName}
                companyInitial={item.companyInitial}
                position={item.position}
                location={item.location}
                duration={item.duration}
                deadline={item.deadline}
                onDetailClick={() => navigate(`/lowongan/${item.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CariLowongan;