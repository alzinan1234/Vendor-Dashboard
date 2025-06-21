"use client";

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search, SlidersHorizontal, Calendar, Clock, MapPin, Edit, Trash2 } from 'lucide-react';

// Mock data for events - replace with your actual data source (e.g., API call)
const allEvents = [
  {
    id: 1,
    title: 'Mojito Madness - Friday!',
    location: 'Luna Lounge, Downtown LA',
    date: 'May 10',
    time: '8:00 PM - 1:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Tech Conference 2025',
    location: 'Convention Center, NYC',
    date: 'June 15',
    time: '9:00 AM - 5:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2532&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Art & Wine Night',
    location: 'The Gallery, San Francisco',
    date: 'July 22',
    time: '7:00 PM - 10:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f49611?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Summer Music Festival',
    location: 'Central Park, NYC',
    date: 'August 5',
    time: '12:00 PM - 11:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Startup Pitch Day',
    location: 'Innovation Hub, Boston',
    date: 'September 12',
    time: '10:00 AM - 4:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2669&auto=format&fit=crop',
  },
    {
    id: 6,
    title: 'Oktoberfest Celebration',
    location: 'Beer Garden, Munich',
    date: 'October 1',
    time: '2:00 PM - 9:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1569429906332-903102d29469?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'Charity Gala Dinner',
    location: 'Grand Ballroom, London',
    date: 'November 18',
    time: '6:30 PM - 11:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1578496479532-30d24c4758eda?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'New Year\'s Eve Bash',
    location: 'Rooftop Bar, Sydney',
    date: 'December 31',
    time: '8:00 PM - 2:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1517263904808-5dc91e3e7024?q=80&w=2574&auto=format&fit=crop',
  },
   {
    id: 9,
    title: 'Indie Film Screening',
    location: 'The Retro Cinema',
    date: 'May 17',
    time: '7:30 PM - 9:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2670&auto=format&fit=crop',
  },
];

const EVENTS_PER_PAGE = 3;

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize filtered events to avoid re-calculating on every render
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleEdit = (id) => {
    console.log("Edit event:", id);
    // Add your edit logic here
  };
  
  const handleDelete = (id) => {
    console.log("Delete event:", id);
    // Add your delete logic here
  };


  return (
    <div className="bg-[#2D2D2D] min-h-screen text-white font-sans rounded-lg flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 w-full">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Events</h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button className="flex items-center bg-[#4A4A4A] hover:bg-[#5A5A5A] transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-lg text-sm">
            <Plus size={18} className="mr-2" />
            Create New Event
          </button>
          <div className="relative flex-grow sm:flex-grow-0">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
              className="bg-[#1E1E1E] border border-[#3A3A3A] rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button className="p-2 bg-[#1E1E1E] border border-[#3A3A3A] rounded-lg hover:bg-[#333] transition-colors duration-200">
            <SlidersHorizontal size={20} className="text-gray-300" />
          </button>
        </div>
      </header>

      {/* Events Grid */}
      <main className="flex-grow">
       {paginatedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedEvents.map((event) => (
              <div key={event.id} className="bg-[#0000001A] rounded-xl overflow-hidden shadow-lg flex flex-col group">
                <div className="relative">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/2D2D2D/FFFFFF?text=Event'; }}/>
                  <div className="absolute top-4 left-4 bg-black/50 p-2 rounded-lg flex items-center space-x-2 text-sm">
                     <Calendar size={16} className="text-gray-300"/>
                     <span>{event.date}</span>
                  </div>
                   <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded-lg flex items-center space-x-2 text-sm">
                     <Clock size={16} className="text-gray-300"/>
                     <span>{event.time}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-grow items-center">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                    <div className="flex items-center gap-2  text-white text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="19" viewBox="0 0 12 19" fill="none">
  <path d="M6.31006 11.2925L5.92041 11.2554C3.30283 11.0079 1.25446 8.80316 1.25439 6.12061C1.25439 3.27196 3.56395 0.962402 6.4126 0.962402C9.26119 0.962468 11.5708 3.272 11.5708 6.12061C11.5707 8.80327 9.52154 11.0081 6.90381 11.2554L6.51514 11.2925V17.562C6.51514 17.6185 6.46906 17.6645 6.4126 17.6646C6.35608 17.6646 6.31006 17.6185 6.31006 17.562V11.2925Z" stroke="white" stroke-width="0.859675"/>
  <path d="M6.41211 4.6875C7.2033 4.6875 7.84457 5.32896 7.84473 6.12012C7.84473 6.9114 7.2034 7.55273 6.41211 7.55273C5.62095 7.55258 4.97949 6.91131 4.97949 6.12012C4.97965 5.32906 5.62105 4.68765 6.41211 4.6875Z" stroke="white" stroke-width="0.859675"/>
  <path opacity="0.3" d="M6.41211 17.7266C6.72723 17.7266 6.99178 17.7913 7.16113 17.876C7.23041 17.9106 7.26824 17.9415 7.29004 17.9619C7.26829 17.9823 7.2305 18.0131 7.16113 18.0479C6.99178 18.1325 6.72723 18.1973 6.41211 18.1973C6.09716 18.1972 5.83336 18.1325 5.66406 18.0479C5.59418 18.0129 5.55588 17.9823 5.53418 17.9619C5.55591 17.9415 5.59437 17.9108 5.66406 17.876C5.83336 17.7914 6.09725 17.7266 6.41211 17.7266Z" fill="white" stroke="white" stroke-width="0.859675"/>
</svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end  space-x-2">
                     <button onClick={() => handleEdit(event.id)} className="p-2 rounded-full bg-[#3A3A3A] hover:bg-blue-600 transition-colors duration-200">
                         <Edit size={18} />
                     </button>
                     <button onClick={() => handleDelete(event.id)} className="p-2 rounded-full bg-[#3A3A3A] hover:bg-red-600 transition-colors duration-200">
                         <Trash2 size={18} />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
             <Search size={48} className="mb-4" />
             <h2 className="text-2xl font-semibold">No Events Found</h2>
             <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </main>

      {/* Pagination */}
      {totalPages > 1 && (
        <footer className="flex justify-center items-center mt-8">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
             <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-[#1E1E1E] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Render page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1E1E1E] hover:bg-[#333]'
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* You can add more complex pagination logic here for many pages (e.g., showing '...') */}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-[#1E1E1E] hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        </footer>
      )}
    </div>
  );
}

