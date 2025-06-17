// components/TrainerManagement.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaPlus, FaSearch, FaCog } from "react-icons/fa";
import AddNewTrainerModal from './AddNewTrainerModal';
import TrainerDetailsModal from './TrainerDetailsModal';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Mock data for trainers
const initialTrainers = [
  {
    id: 1234,
    name: "John Smith",
    avatar: "/image/trainer-avater.png",
    email: "john.smith@gmail.com",
    perHourRate: 50,
    yearsExperience: 10,
    coachingExpertise: "Doubles Strategy",
    bio: "With over 12 years of coaching experience, Coach John specializes in doubles strategy, footwork mastery, and tournament preparation. An IPTPA-certified instructor and former national champion, he has helped players of all levels refine their technique and elevate their game. Passionate about precision and strategy, Coach John's training focuses on building confidence, smart shot selection, and court awareness. Whether you're a beginner or a competitive player, his tailored coaching approach ensures measurable improvement and on court success. 🎾🔥",
    achievements: [
      "Certified IPTPA Level II Coach – Recognized for excellence in player development",
      "Coached 100+ Players to Tournament Wins – Including state and national titles",
      "Former Professional Player – Developed in [League/Tournament Series] at an elite level",
      "Featured Speaker at Pickleball Summits – Conducted training workshops and strategy sessions",
      "Top-Ranked Doubles Player – Dominated competitive circuits",
      "Developed Training Programs for Elite Players – Customized drills and performance-based coaching",
    ],
    location: "Downtown Los Angeles, CA",
    preferredTrainingLocations: ["Downtown Los Angeles, CA"],
    availability: "Monday to Friday",
    timeSlots: ["10:40 AM - 11:00 AM", "10:40 AM - 11:00 AM"]
  },
  {
    id: 1235,
    name: "Jane Doe",
    avatar: "/image/trainer-avater.png",
    email: "jane.doe@example.com",
    perHourRate: 60,
    yearsExperience: 7,
    coachingExpertise: "Singles Tactics",
    bio: "Jane Doe is a highly experienced tennis coach specializing in singles tactics and mental game development. She has helped numerous players improve their court coverage and strategic thinking.",
    achievements: [
      "Certified USPTA Professional",
      "Coached collegiate players to national championships",
      "Developed personalized training plans for aspiring professionals"
    ],
    location: "Santa Monica, CA",
    preferredTrainingLocations: ["Santa Monica, CA", "Venice Beach, CA"],
    availability: "Tuesday, Thursday",
    timeSlots: ["09:00 AM - 10:00 AM", "01:00 PM - 02:00 PM"]
  },
  {
    id: 1236,
    name: "Michael Chen",
    avatar: "/image/userImage.png",
    email: "michael.chen@example.com",
    perHourRate: 55,
    yearsExperience: 8,
    coachingExpertise: "Serve & Return",
    bio: "Michael is passionate about helping players master their serve and return game. He focuses on technique, power, and consistency.",
    achievements: [
      "Top-ranked local player",
      "Certified PTR professional",
      "Coached multiple junior champions"
    ],
    location: "San Diego, CA",
    preferredTrainingLocations: ["San Diego, CA"],
    availability: "Wednesday, Friday, Saturday",
    timeSlots: ["08:00 AM - 09:00 AM", "05:00 PM - 06:00 PM"]
  },
  {
    id: 1237,
    name: "Emily White",
    avatar: "/image/trainer-avater.png",
    email: "emily.white@example.com",
    perHourRate: 65,
    yearsExperience: 12,
    coachingExpertise: "Footwork & Agility",
    bio: "Emily White is a dynamic coach focused on enhancing player mobility and court speed through specialized footwork drills.",
    achievements: [
      "Certified Strength & Conditioning Specialist",
      "Trained national-level athletes",
      "Authored popular pickleball training guides"
    ],
    location: "Miami, FL",
    preferredTrainingLocations: ["Miami, FL"],
    availability: "Monday, Wednesday, Friday",
    timeSlots: ["11:00 AM - 12:00 PM", "03:00 PM - 04:00 PM"]
  },
  {
    id: 1238,
    name: "David Lee",
    avatar: "/image/trainer-avater.png",
    email: "david.lee@example.com",
    perHourRate: 45,
    yearsExperience: 5,
    coachingExpertise: "Beginner Foundations",
    bio: "David Lee specializes in introducing new players to pickleball, focusing on fundamental techniques and rules to build a strong base.",
    achievements: [
      "Certified Pickleball Instructor",
      "Helped 500+ beginners start their pickleball journey",
      "Organized community pickleball workshops"
    ],
    location: "Austin, TX",
    preferredTrainingLocations: ["Austin, TX"],
    availability: "Tuesday, Thursday, Saturday",
    timeSlots: ["09:00 AM - 10:00 AM", "02:00 PM - 03:00 PM"]
  },
  {
    id: 1239,
    name: "Sarah Brown",
    avatar: "/image/trainer-avater.png",
    email: "sarah.brown@example.com",
    perHourRate: 70,
    yearsExperience: 15,
    coachingExpertise: "Advanced Strategy",
    bio: "Sarah Brown is a master strategist, guiding advanced players through complex game scenarios and high-pressure situations.",
    achievements: [
      "Former Pro Tour Player",
      "Coached multiple national champions",
      "Runs elite training camps"
    ],
    location: "New York, NY",
    preferredTrainingLocations: ["New York, NY"],
    availability: "Weekends",
    timeSlots: ["10:00 AM - 11:00 AM", "04:00 PM - 05:00 PM"]
  },
  {
    id: 1240,
    name: "Chris Green",
    avatar: "/image/trainer-avater.png",
    email: "chris.green@example.com",
    perHourRate: 52,
    yearsExperience: 6,
    coachingExpertise: "Volley & Net Play",
    bio: "Chris Green helps players dominate the net with expert instruction on volleys, dinks, and strategic positioning.",
    achievements: [
      "Certified Pickleball Coach",
      "Specializes in competitive doubles play",
      "Runs popular net play clinics"
    ],
    location: "Denver, CO",
    preferredTrainingLocations: ["Denver, CO"],
    availability: "Monday, Tuesday, Thursday",
    timeSlots: ["08:30 AM - 09:30 AM", "01:30 PM - 02:30 PM"]
  },
  {
    id: 1241,
    name: "Laura Blue",
    avatar: "/image/trainer-avater.png",
    email: "laura.blue@example.com",
    perHourRate: 58,
    yearsExperience: 9,
    coachingExpertise: "Mental Game",
    bio: "Laura Blue focuses on the psychological aspects of pickleball, helping players build resilience, focus, and confidence under pressure.",
    achievements: [
      "Sports Psychologist Certified",
      "Works with professional athletes",
      "Author of 'Mindful Pickleball'"
    ],
    location: "Seattle, WA",
    preferredTrainingLocations: ["Seattle, WA"],
    availability: "Wednesday, Friday",
    timeSlots: ["10:00 AM - 11:00 AM", "03:00 PM - 04:00 PM"]
  },
  {
    id: 1242,
    name: "Kevin Red",
    avatar: "/image/trainer-avater.png",
    email: "kevin.red@example.com",
    perHourRate: 62,
    yearsExperience: 11,
    coachingExpertise: "Power Hitting",
    bio: "Kevin Red is all about power. He trains players to develop explosive shots and dominant court presence.",
    achievements: [
      "Former Collegiate Athlete",
      "Specializes in biomechanics for power",
      "Holds speed serving records"
    ],
    location: "Chicago, IL",
    preferredTrainingLocations: ["Chicago, IL"],
    availability: "Monday, Thursday, Saturday",
    timeSlots: ["09:30 AM - 10:30 AM", "02:30 PM - 03:30 PM"]
  },
  {
    id: 1243,
    name: "Olivia Grey",
    avatar: "/image/trainer-avater.png",
    email: "olivia.grey@example.com",
    perHourRate: 53,
    yearsExperience: 6,
    coachingExpertise: "Drills & Practice Routines",
    bio: "Olivia Grey provides structured training programs and effective drill routines to maximize practice efficiency and skill retention.",
    achievements: [
      "Certified Coaching Specialist",
      "Develops customized practice plans",
      "Runs popular group clinics"
    ],
    location: "Phoenix, AZ",
    preferredTrainingLocations: ["Phoenix, AZ"],
    availability: "Tuesday, Friday",
    timeSlots: ["11:00 AM - 12:00 PM", "04:00 PM - 05:00 PM"]
  },
];


const TrainerManagement = () => {
  const [isAddNewTrainerModalOpen, setIsAddNewTrainerModalOpen] = useState(false);
  const [isTrainerDetailsModalOpen, setIsTrainerDetailsModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTrainers, setCurrentTrainers] = useState(initialTrainers);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 5; // You can adjust this number

  const filteredTrainers = currentTrainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.id.toString().includes(searchTerm.toLowerCase())
  );

  // --- Pagination Logic ---
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainersOnPage = filteredTrainers.slice(indexOfFirstTrainer, indexOfLastTrainer);

  const totalPages = Math.ceil(filteredTrainers.length / trainersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Show a few pages around the current page, and ellipsis
    const maxPagesToShow = 5; // Max number of page buttons to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) => (
      <button
        key={index} // Use index if numbers can be repeated (e.g., for '...')
        onClick={() => typeof number === 'number' && paginate(number)}
        className={`w-8 h-8 flex items-center justify-center rounded ${
          currentPage === number ? 'bg-cyan-500 text-white' : 'hover:bg-[#2d2d2d] text-gray-400'
        } ${typeof number !== 'number' ? 'cursor-default' : ''}`} // Disable click for '...'
        disabled={typeof number !== 'number'}
      >
        {number}
      </button>
    ));
  };


  const addNewTrainer = (newTrainerData) => {
    setCurrentTrainers(prevTrainers => [
      ...prevTrainers,
      { ...newTrainerData, id: Date.now(), avatar: "/images/default-trainer-avatar.png" }
    ]);
    setIsAddNewTrainerModalOpen(false);
    // After adding, go to the last page to see the new trainer
    setCurrentPage(Math.ceil((currentTrainers.length + 1) / trainersPerPage));
  };

  const handleViewDetails = (trainerId) => {
    const trainer = currentTrainers.find(t => t.id === trainerId);
    if (trainer) {
      setSelectedTrainer(trainer);
      setIsTrainerDetailsModalOpen(true);
    }
  };

  const handleEditTrainer = (trainerId) => {
    console.log(`Edit trainer with ID: ${trainerId}`);
    // Implement edit logic here (e.g., open a modal in edit mode)
  };

  const handleDeleteTrainer = (trainerId) => {
    if (window.confirm(`Are you sure you want to delete trainer with ID: ${trainerId}?`)) {
      setCurrentTrainers(prevTrainers => prevTrainers.filter(trainer => trainer.id !== trainerId));
      // Adjust current page if the last trainer on a page was deleted
      if (currentTrainersOnPage.length === 1 && currentPage > 1 && filteredTrainers.length - 1 <= indexOfFirstTrainer) {
        setCurrentPage(prev => prev - 1);
      }
      console.log(`Trainer with ID ${trainerId} deleted.`);
    }
  };


  return (
    <>
      <div className="bg-[#343434] p-6 rounded-lg text-white">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trainer Management</h2>
          <div className="flex items-center gap-2">
            {/* Add New Trainer Button */}
            <button
              onClick={() => setIsAddNewTrainerModalOpen(true)}
              className="flex items-center gap-2 pl-[2px] pr-[13px] py-1"
              style={{
                borderRadius: '22px',
                background: 'rgba(255,255,255,0.10)',
              }}
            >
              <span className="w-[27px] h-[27px] flex items-center justify-center text-black rounded-full bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 27 27" fill="none">
                  <path d="M13.49 6.75L13.49 20.25" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20.24 13.5L6.73999 13.5" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-white font-medium text-[12px]">Add New Trainer</span>
            </button>

            {/* Search Input and Button Group */}
            <div className="flex items-center ">
              <div className="relative ">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A]   text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>

              <button className=" hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                >
                  <path
                    d="M11 8.5L20 8.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 16.5L14 16.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="7"
                    cy="8.5"
                    rx="3"
                    ry="3"
                    transform="rotate(90 7 8.5)"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="17"
                    cy="16.5"
                    rx="3"
                    ry="3"
                    transform="rotate(90 17 16.5)"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-4">
            <thead className="bg-[#17787C]">
              <tr className="text-sm text-white">
                <th className="py-3 px-4 text-center">Trainer ID</th>
                <th className="py-3 px-4 text-center">Name</th>
                <th className="py-3 px-4 text-center">Email</th>
                <th className="py-3 px-4 text-center">Per Hour Rate</th>
                <th className="py-3 px-4 text-center">Years experience</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="border-b border-gray-600 ">
              {currentTrainersOnPage.length > 0 ? (
                currentTrainersOnPage.map((trainer, index) => (
                  <tr key={trainer.id} className="border-b border-gray-600 text-sm text-white py-10">
                    <td className="py- px-4 text-center border-b border-gray-600">{trainer.id}</td>
                    <td className="py-5 px-4 text-center flex items-center justify-center gap-2 border-b border-gray-600">
                      <Image
                        src={trainer.avatar}
                        alt="Trainer Avatar"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      {trainer.name}
                    </td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">{trainer.email}</td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">${trainer.perHourRate}</td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">{trainer.yearsExperience}</td>
                    <td className="py-2 px-4 text-center border-b border-gray-600">
                      <div className="flex justify-center gap-2 ">
                        {/* View Button (eye icon) */}
                        <button
                          onClick={() => handleViewDetails(trainer.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Image src="/icon/eye.svg" alt="View" width={25} height={25} />
                        </button>
                        {/* Edit Button (pencil icon) */}
                        <button
                          onClick={() => handleEditTrainer(trainer.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Image src="/icon/edit.png" alt="Edit" width={25} height={25} />
                        </button>
                        {/* Delete Button (trash icon) */}
                        <button
                          onClick={() => handleDeleteTrainer(trainer.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Image src="/icon/trash.svg" alt="Delete" width={25} height={25} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">No trainers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* AddNewTrainerModal Component */}
        <AddNewTrainerModal
          isOpen={isAddNewTrainerModalOpen}
          onClose={() => setIsAddNewTrainerModalOpen(false)}
          onAddTrainer={addNewTrainer}
        />

        {/* TrainerDetailsModal Component */}
        <TrainerDetailsModal
          isOpen={isTrainerDetailsModalOpen}
          onClose={() => setIsTrainerDetailsModalOpen(false)}
          trainer={selectedTrainer}
        />
      </div>

      {/* Pagination Section */}
      <div className="flex justify-end items-center mt-6 gap-2 text-sm">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${currentPage === 1 ? 'cursor-not-allowed border-gray-700 text-gray-700' : 'hover:bg-[#2d2d2d] text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="15" viewBox="0 0 8 15" fill="none">
            <path d="M6.99995 13.4502C6.99995 13.4502 1.00001 9.03126 0.999999 7.45015C0.999986 5.86903 7 1.4502 7 1.4502" stroke="#E2E2E2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg> {/* Left arrow */}
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`w-8 h-8 flex items-center rounded-full border justify-center ${currentPage === totalPages || totalPages === 0 ? 'cursor-not-allowed border-gray-700 text-gray-700' : 'hover:bg-[#2d2d2d] text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="15" viewBox="0 0 8 15" fill="none">
            <path d="M1.00005 1.4502C1.00005 1.4502 6.99999 5.86913 7 7.45024C7.00001 9.03136 1 13.4502 1 13.4502" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg> {/* Right arrow */}
        </button>
      </div>
    </>
  );
};

export default TrainerManagement;