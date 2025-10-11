"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Upload,
  Plus,
  Loader2,
  X
} from "lucide-react";
import { venueService } from "@/lib/venueService";
import { nightlifeEventService } from "@/lib/nightlifeEventService";


// Time Slot Modal Component
function TimeSlotModal({ onClose, onCreate }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await onCreate(startTime, endTime);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2D2D2D] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Create Time Slot</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 px-4 rounded-lg bg-[#00C1C9] hover:bg-[#00a8b0] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Form Component
export default function CreateEventForm({ onBack, onSuccess, editingEvent = null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [entryTypes, setEntryTypes] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [venueId, setVenueId] = useState(null);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [bannerName, setBannerName] = useState("");
  
  const [formData, setFormData] = useState({
    name: editingEvent?.name || "",
    description: editingEvent?.description || "",
    date: editingEvent?.date || "",
    time: editingEvent?.time || "",
    maxGuests: editingEvent?.max_number_of_guests || "",
    pricePerPerson: editingEvent?.price_per_person || "",
    address: editingEvent?.address || "",
    phoneNumber: editingEvent?.phone_number || "",
    email: editingEvent?.email || "",
    website: editingEvent?.website || "",
    entryTypeId: editingEvent?.entry_type?.id || "",
    timeSlotId: editingEvent?.time_slot?.id || "",
    coverImage: null,
    coverImagePreview: editingEvent?.cover_image || null
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const venueIdResult = await venueService.getMyVenueId();
      setVenueId(venueIdResult);
      
      const [entryTypesResult, timeSlotsResult] = await Promise.all([
        nightlifeEventService.getEntryTypes(),
        nightlifeEventService.getTimeSlots(venueIdResult)
      ]);

      if (entryTypesResult.success) {
        setEntryTypes(entryTypesResult.data);
      }
      if (timeSlotsResult.success) {
        setTimeSlots(timeSlotsResult.data);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerName(file.name);
      setFormData(prev => ({
        ...prev,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleCreateTimeSlot = async (startTime, endTime) => {
    const result = await nightlifeEventService.createTimeSlot(startTime, endTime);
    if (result.success && venueId) {
      const timeSlotsResult = await nightlifeEventService.getTimeSlots(venueId);
      if (timeSlotsResult.success) {
        setTimeSlots(timeSlotsResult.data);
        setFormData(prev => ({ ...prev, timeSlotId: result.data.id }));
      }
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const eventData = {
        name: formData.name,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        maxGuests: parseInt(formData.maxGuests),
        pricePerPerson: parseFloat(formData.pricePerPerson),
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        website: formData.website,
        entryTypeId: formData.entryTypeId || null,
        timeSlotId: formData.timeSlotId || null,
        isFeatured: false,
        coverImage: formData.coverImage
      };

      let result;
      if (editingEvent) {
        result = await nightlifeEventService.updateEvent(editingEvent.id, eventData);
      } else {
        result = await nightlifeEventService.createEvent(eventData);
      }

      if (result.success) {
        onSuccess(result.message);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#2D2D2D] min-h-screen text-white font-sans rounded-lg flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="flex items-center gap-4 mb-8 w-full">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">
          {editingEvent ? 'Edit Event' : 'Create New Event'}
        </h1>
      </header>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center justify-between">
          <span className="text-red-200">{error}</span>
          <button onClick={() => setError("")} className="text-red-200 hover:text-white">
            <X size={18} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-grow flex flex-col space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-300">
            Event Title
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-300">
            Event Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-gray-300">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9] custom-date-input"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium text-gray-300">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9] custom-date-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="maxGuests" className="text-sm font-medium text-gray-300">
            Max number of attendees
          </label>
          <input
            type="number"
            id="maxGuests"
            name="maxGuests"
            value={formData.maxGuests}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="pricePerPerson" className="text-sm font-medium text-gray-300">
            Price per ticket
          </label>
          <input
            type="number"
            id="pricePerPerson"
            name="pricePerPerson"
            value={formData.pricePerPerson}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium text-gray-300">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium text-gray-300">
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://"
            className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label htmlFor="entryTypeId" className="text-sm font-medium text-gray-300">
              Entry Type
            </label>
            <select
              id="entryTypeId"
              name="entryTypeId"
              value={formData.entryTypeId}
              onChange={handleInputChange}
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
            >
              <option value="">Select Entry Type</option>
              {entryTypes.map(type => (
                <option key={type.id} value={type.id}>{type.type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Upload Banner</label>
          <div className="relative w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400">
            {formData.coverImagePreview ? (
              <div className="relative w-full h-full">
                <img 
                  src={formData.coverImagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      coverImage: null, 
                      coverImagePreview: null 
                    }));
                    setBannerName("");
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="bannerUpload"
                  name="bannerUpload"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <Upload size={32} />
                <p className="mt-2 text-sm">{bannerName || "Upload"}</p>
              </>
            )}
          </div>
        </div>

        {/* Time slot section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-base font-medium text-gray-300">Time slot:</label>
            <button
              type="button"
              onClick={() => setShowTimeSlotModal(true)}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {timeSlots.length === 0 && (
              <p className="text-sm text-gray-500">No time slots added yet. Click '+' to add one.</p>
            )}
            {timeSlots.map((slot) => (
              <div key={slot.id} className="flex items-center">
                <input
                  type="radio"
                  id={`timeSlot-${slot.id}`}
                  name="timeSlotId"
                  value={slot.id}
                  checked={formData.timeSlotId == slot.id}
                  onChange={handleInputChange}
                  className="form-radio h-4 w-4 text-[#00C1C9] border-gray-600 focus:ring-[#00C1C9]"
                />
                <label htmlFor={`timeSlot-${slot.id}`} className="ml-2 text-white text-sm">
                  {slot.start_time} - {slot.end_time}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-grow"></div>

        <div className="col-span-full mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-3 font-medium border-b-4 border-lime-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                {editingEvent ? 'Updating Event...' : 'Publishing Event...'}
              </>
            ) : (
              editingEvent ? 'Update Event' : 'Publish Event'
            )}
          </button>
        </div>
      </form>

      {showTimeSlotModal && (
        <TimeSlotModal 
          onClose={() => setShowTimeSlotModal(false)} 
          onCreate={handleCreateTimeSlot}
        />
      )}
    </div>
  );
}