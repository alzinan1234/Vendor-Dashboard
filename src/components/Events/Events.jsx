// App.js
// This component is ready for a Next.js App Router environment.
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Calendar,
  Clock,
} from "lucide-react";
import CreateEventForm from "./CreateEventForm";

// Mock data for events - replace with your actual data source (e.g., API call)
const allEvents = [
  {
    id: 1,
    title: "Mojito Madness - Friday!",
    location: "Luna Lounge, Downtown LA",
    date: "May 10",
    time: "8:00 PM - 1:00 AM",
    imageUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Tech Conference 2025",
    location: "Convention Center, NYC",
    date: "June 15",
    time: "9:00 AM - 5:00 PM",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2532&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Art & Wine Night",
    location: "The Gallery, San Francisco",
    date: "July 22",
    time: "7:00 PM - 10:00 PM",
    imageUrl:
      "https://images.unsplash.com/photo-1547595628-c61a29f49611?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Summer Music Festival",
    location: "Central Park, NYC",
    date: "August 5",
    time: "12:00 PM - 11:00 PM",
    imageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Startup Pitch Day",
    location: "Innovation Hub, Boston",
    date: "September 12",
    time: "10:00 AM - 4:00 PM",
    imageUrl:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2669&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Oktoberfest Celebration",
    location: "Beer Garden, Munich",
    date: "October 1",
    time: "2:00 PM - 9:00 PM",
    imageUrl:
      "https://images.unsplash.com/photo-1569429906332-903102d29469?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Charity Gala Dinner",
    location: "Grand Ballroom, London",
    date: "November 18",
    time: "6:30 PM - 11:30 PM",
    imageUrl:
      "https://images.unsplash.com/photo-1578496479532-30d24c4758eda?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "New Year's Eve Bash",
    location: "Rooftop Bar, Sydney",
    date: "December 31",
    time: "8:00 PM - 2:00 AM",
    imageUrl:
      "https://images.unsplash.com/photo-1517263904808-5dc91e3e7024?q=80&w=2574&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "Indie Film Screening",
    location: "The Retro Cinema",
    date: "May 17",
    time: "7:30 PM - 9:30 PM",
    imageUrl:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2670&auto=format&fit=crop",
  },
];

const EVENTS_PER_PAGE = 3;

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const eventsTopRef = useRef(null);

  // Memoize filtered events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / EVENTS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredEvents, totalPages, currentPage]);

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  const paginate = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      if (eventsTopRef.current) {
        eventsTopRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  
  const handleEdit = (id) => console.log("Edit event:", id);
  const handleDelete = (id) => console.log("Delete event:", id);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfPages = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfPages);
    let endPage = Math.min(totalPages, currentPage + halfPages);

    if (currentPage - halfPages < 1) endPage = Math.min(totalPages, maxPagesToShow);
    if (currentPage + halfPages > totalPages) startPage = Math.max(1, totalPages - maxPagesToShow + 1);

    if (startPage > 1) {
        pageNumbers.push(<button key={1} onClick={() => paginate(1)} className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-blue-600">1</button>);
        if (startPage > 2) pageNumbers.push(<span key="start-ellipsis" className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>);
    }
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <button key={i} onClick={() => paginate(i)} className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-200 ${ currentPage === i ? 'bg-[#00C1C9] text-white' : 'text-white hover:bg-[#3A3A3A]'}`}>
                {i}
            </button>
        );
    }
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push(<span key="end-ellipsis" className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>);
        pageNumbers.push(<button key={totalPages} onClick={() => paginate(totalPages)} className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-blue-600">{totalPages}</button>);
    }
    return pageNumbers;
  };
  
  // Conditional Rendering Logic
  if (showCreateForm) {
    return (
      <CreateEventForm onBack={() => setShowCreateForm(false)} onPublish={() => setShowCreateForm(false)} />
    );
  }

  return (
    <div className="bg-[#343434] min-h-screen text-white font-sans rounded-lg flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 w-full">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Events</h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            className="flex items-center bg-[#4A4A4A] hover:bg-[#5A5A5A] transition-colors duration-200 text-white  py-2 px-4 rounded-full font-medium text-[12px]"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus  size={18} className="mr-2  text-white rounded-full" />
            Create New Event
          </button>
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 bg-black/10 rounded-l-lg border border-black/10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}/>
            </div>
            <button className="hover:bg-gray-700/50 transition-colors bg-[#2A2A2A] p-2 rounded-r-lg">
                <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 8.5L20 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M4 16.5L14 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><ellipse cx="7" cy="8.5" rx="3" ry="3" transform="rotate(90 7 8.5)" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><ellipse cx="17" cy="16.5" rx="3" ry="3" transform="rotate(90 17 16.5)" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Events Grid */}
      <main className="flex-grow" ref={eventsTopRef}>
        {paginatedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedEvents.map((event) => (
              <div key={event.id} className="bg-black/10 rounded-xl overflow-hidden shadow-lg flex flex-col group">
                <div className="relative h-48">
                  <div className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-105" style={{background: `linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%), url(${event.imageUrl}) center/cover no-repeat`}}/>
                  <div className="absolute bottom-12 left-4 p-2 rounded-lg flex items-center space-x-2 text-sm z-10"><Calendar size={16} className="text-gray-300" /><span>{event.date}</span></div>
                  <div className="absolute bottom-2 left-4 p-2 rounded-lg flex items-center space-x-2 text-sm z-10"><Clock size={16} className="text-gray-300" /><span>{event.time}</span></div>
                </div>
                <div className="p-5 flex flex-grow items-center">
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                    <div className="flex gap-2 items-center text-white text-sm">
                      <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.31006 11.2925L5.92041 11.2554C3.30283 11.0079 1.25446 8.80316 1.25439 6.12061C1.25439 3.27196 3.56395 0.962402 6.4126 0.962402C9.26119 0.962468 11.5708 3.272 11.5708 6.12061C11.5707 8.80327 9.52154 11.0081 6.90381 11.2554L6.51514 11.2925V17.562C6.51514 17.6185 6.46906 17.6645 6.4126 17.6646C6.35608 17.6646 6.31006 17.6185 6.31006 17.562V11.2925Z" stroke="white" strokeWidth="0.859675"/><path d="M6.41211 4.6875C7.2033 4.6875 7.84457 5.32896 7.84473 6.12012C7.84473 6.9114 7.2034 7.55273 6.41211 7.55273C5.62095 7.55258 4.97949 6.91131 4.97949 6.12012C4.97965 5.32906 5.62105 4.68765 6.41211 4.6875Z" stroke="white" strokeWidth="0.859675"/><path opacity="0.3" d="M6.41211 17.7266C6.72723 17.7266 6.99178 17.7913 7.16113 17.876C7.23041 17.9106 7.26824 17.9415 7.29004 17.9619C7.26829 17.9823 7.2305 18.0131 7.16113 18.0479C6.99178 18.1325 6.72723 18.1973 6.41211 18.1973C6.09716 18.1972 5.83336 18.1325 5.66406 18.0479C5.59418 18.0129 5.55588 17.9823 5.53418 17.9619C5.55591 17.9415 5.59437 17.9108 5.66406 17.876C5.83336 17.7914 6.09725 17.7266 6.41211 17.7266Z" fill="white" stroke="white" strokeWidth="0.859675"/></svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleEdit(event.id)} className="p-1.5 rounded-full border border-[#C267FF] hover:bg-purple-500/20 transition-colors duration-200"><svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.1753 6.63916C15.5663 6.63916 15.88 6.80482 16.1519 7.01221C16.4098 7.20902 16.6929 7.49371 17.0142 7.81494L17.1851 7.98584C17.5063 8.30707 17.791 8.59024 17.9878 8.84814C18.1952 9.11996 18.3608 9.43367 18.3608 9.82471C18.3608 10.2157 18.1952 10.5295 17.9878 10.8013C17.791 11.0592 17.5063 11.3423 17.1851 11.6636L9.9917 18.8569C9.81964 19.029 9.65806 19.1976 9.45264 19.314C9.24715 19.4303 9.01977 19.4825 8.78369 19.5415L6.12939 20.2046C5.96846 20.2448 5.78124 20.2937 5.62354 20.3091C5.45841 20.3252 5.15876 20.3238 4.91748 20.0825C4.6762 19.8412 4.67476 19.5416 4.69092 19.3765C4.70635 19.2188 4.75517 19.0315 4.79541 18.8706L5.4585 16.2163C5.51751 15.9802 5.56969 15.7528 5.68604 15.5474C5.80241 15.3419 5.97101 15.1804 6.14307 15.0083L13.3364 7.81494C13.6577 7.49371 13.9408 7.20902 14.1987 7.01221C14.4705 6.80482 14.7843 6.63916 15.1753 6.63916Z" stroke="#C267FF" strokeWidth="1.2"/><path d="M12.6753 8.32471L16.6753 12.3247" stroke="#C267FF" strokeWidth="1.2"/></svg></button>
                    <button onClick={() => handleDelete(event.id)} className="p-2 rounded-full border border-[#FF0000] hover:bg-red-500/20 transition-colors duration-200"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.9292 9.69482L6.9292 7.82514" stroke="#FF0000" strokeWidth="1.24645" strokeLinecap="round"/><path d="M9.42188 9.69482L9.42187 7.82514" stroke="#FF0000" strokeWidth="1.24645" strokeLinecap="round"/><path d="M2.56641 4.70898H13.7845V4.70898C13.2037 4.70898 12.9133 4.70898 12.6843 4.80387C12.3789 4.93037 12.1362 5.17302 12.0097 5.47844C11.9148 5.7075 11.9148 5.99789 11.9148 6.57867V10.318C11.9148 11.4932 11.9148 12.0808 11.5497 12.4459C11.1847 12.8109 10.5971 12.8109 9.4219 12.8109H6.92899C5.75383 12.8109 5.16624 12.8109 4.80117 12.4459C4.43609 12.0808 4.43609 11.4932 4.43609 10.318V6.57866C4.43609 5.99789 4.43609 5.7075 4.34121 5.47844C4.2147 5.17302 3.97205 4.93037 3.66663 4.80387C3.43757 4.70898 3.14718 4.70898 2.56641 4.70898V4.70898Z" stroke="#FF0000" strokeWidth="1.24645" strokeLinecap="round"/><path d="M6.97144 2.44678C7.04246 2.38052 7.19894 2.32197 7.41663 2.28021C7.63431 2.23846 7.90103 2.21582 8.17542 2.21582C8.44981 2.21582 8.71653 2.23846 8.93421 2.28021C9.1519 2.32197 9.30839 2.38052 9.3794 2.44678" stroke="#FF0000" strokeWidth="1.24645" strokeLinecap="round"/></svg></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
            <Search size={48} className="mb-4" />
            <h2 className="text-2xl font-semibold">No Events Found</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </main>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <footer className="flex justify-end items-center mt-8">
            <nav className="flex items-center space-x-2" aria-label="Pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-[#3A3A3A]"><ChevronLeft size={20} /></button>
                {renderPageNumbers()}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-[#3A3A3A]"><ChevronRight size={20} /></button>
            </nav>
        </footer>
      )}
    </div>
  );
}
