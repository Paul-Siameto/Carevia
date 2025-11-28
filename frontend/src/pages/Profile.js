import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { FiUpload, FiUser, FiX, FiCheck } from "react-icons/fi";

const Profile = () => {
    const { token, user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [age, setAge] = useState(user?.healthProfile?.age || "");
    const [heightCm, setHeightCm] = useState(user?.healthProfile?.heightCm || "");
    const [weightKg, setWeightKg] = useState(user?.healthProfile?.weightKg || "");
    const [bmi, setBmi] = useState(user?.healthProfile?.bmi || null);
    const [bmiHistory, setBmiHistory] = useState(user?.healthProfile?.bmiHistory || []);
    const [message, setMessage] = useState(null);
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
    const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setAge(user.healthProfile?.age || "");
            setHeightCm(user.healthProfile?.heightCm || "");
            setWeightKg(user.healthProfile?.weightKg || "");
            setBmi(user.healthProfile?.bmi || null);
            setBmiHistory(user.healthProfile?.bmiHistory || []);
            setProfilePicture(user.profilePicture || null);
            setPreviewUrl(user.profilePicture || null);
        }
    }, [user]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeProfilePicture = (e) => {
        e.stopPropagation();
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadProfilePicture = async () => {
        if (!previewUrl) return;
        
        try {
            setIsUploading(true);
            const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const baseURL = base.endsWith("/api") ? base : `${base}/api`;
            const api = axios.create({ baseURL });
            
            api.interceptors.request.use((config) => { 
                if (token) config.headers.Authorization = `Bearer ${token}`; 
                return config; 
            });

            if (previewUrl.startsWith('data:')) {
                try {
                    const formData = new FormData();
                    if (!fileInputRef.current?.files?.[0]) {
                        throw new Error('No file selected');
                    }
                    
                    // Append the file
                    const file = fileInputRef.current.files[0];
                    formData.append('profilePicture', file);
                    
                    // Append other fields individually
                    formData.append('name', name || '');
                    formData.append('age', age ? age.toString() : '');
                    formData.append('heightCm', heightCm ? heightCm.toString() : '');
                    formData.append('weightKg', weightKg ? weightKg.toString() : '');
                    formData.append('bmi', calculateBmi(weightKg, heightCm) || '');
                    
                    console.log('Sending profile update with file...');
                    const response = await api.put('/users/me', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        transformRequest: (data, headers) => {
                            // Let the browser set the content type with the correct boundary
                            delete headers['Content-Type'];
                            return data;
                        }
                    });
                    
                    console.log('Profile update response:', response.data);
                    
                    // Update both local state and user context
                    if (response.data?.profilePicture) {
                        setProfilePicture(response.data.profilePicture);
                        setPreviewUrl(response.data.profilePicture);
                    }
                    
                    if (updateUser) {
                        updateUser({ 
                            ...user,
                            ...response.data,
                            name: response.data.name || user.name,
                            healthProfile: {
                                ...(response.data.healthProfile || {}),
                                bmi: calculateBmi(weightKg, heightCm)
                            }
                        });
                    }
                    
                    setMessage("Profile updated successfully");
                    return response.data;
                } catch (error) {
                    console.error('Error in file upload:', error);
                    if (error.response) {
                        console.error('Server response:', error.response.data);
                        throw new Error(error.response.data.message || 'Failed to update profile with image');
                    } else if (error.request) {
                        console.error('No response received:', error.request);
                        throw new Error('No response from server. Please check your connection.');
                    } else {
                        console.error('Request setup error:', error.message);
                        throw new Error(`Failed to update profile: ${error.message}`);
                    }
                }
            } else if (previewUrl === null) {
                // Handle profile picture removal
                const response = await api.put('/users/me', { 
                    profilePicture: null,
                    name: name || undefined,
                    healthProfile: {
                        age: age ? parseInt(age) : undefined,
                        heightCm: heightCm ? parseFloat(heightCm) : undefined,
                        weightKg: weightKg ? parseFloat(weightKg) : undefined,
                        bmi: calculateBmi(weightKg, heightCm)
                    }
                });
                
                setProfilePicture(null);
                if (updateUser) {
                    updateUser({
                        ...user,
                        ...response.data,
                        profilePicture: null
                    });
                }
                setMessage("Profile picture removed successfully");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            let errorMessage = "Error updating profile. Please try again.";
            
            if (error.response) {
                // Server responded with an error status code
                console.error('Error response data:', error.response.data);
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
                
                if (error.response.status === 400) {
                    errorMessage = error.response.data?.message || 'Invalid data. Please check your inputs.';
                } else if (error.response.status === 401) {
                    errorMessage = 'Session expired. Please log in again.';
                } else if (error.response.status === 413) {
                    errorMessage = 'File too large. Please choose a smaller image.';
                } else if (error.response.status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            } else if (error.request) {
                // Request was made but no response received
                console.error('No response received:', error.request);
                errorMessage = 'No response from server. Please check your connection.';
            } else if (error.message) {
                // Something happened in setting up the request
                errorMessage = error.message;
            }
            
            setMessage(errorMessage);
            setTimeout(() => setMessage(null), 5000);
            // Revert to the previous profile picture on error
            setPreviewUrl(profilePicture);
        } finally {
            setIsUploading(false);
        }
    };

    const calculateBmi = (weight, height) => {
        if (!weight || !height) return null;
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    };

    const getBmiCategory = (bmiValue) => {
        if (!bmiValue) return "";
        if (bmiValue < 18.5) return "Underweight";
        if (bmiValue < 25) return "Normal weight";
        if (bmiValue < 30) return "Overweight";
        return "Obese";
    };

    const onSave = async () => {
        try {
            const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const baseURL = base.endsWith("/api") ? base : `${base}/api`;
            const api = axios.create({ baseURL });
            api.interceptors.request.use((config) => { 
                if (token) config.headers.Authorization = `Bearer ${token}`; 
                return config; 
            });

            const currentBmi = calculateBmi(weightKg, heightCm);
            const newBmiEntry = currentBmi ? {
                bmi: parseFloat(currentBmi),
                weightKg: parseFloat(weightKg),
                heightCm: parseFloat(heightCm),
                date: new Date().toISOString()
            } : null;

            const updatedBmiHistory = newBmiEntry 
                ? [...(bmiHistory || []), newBmiEntry]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 30) // Keep only last 30 entries
                : bmiHistory;

            const updateData = { 
                name, 
                healthProfile: { 
                    age: age ? parseInt(age) : undefined,
                    heightCm: heightCm ? parseFloat(heightCm) : undefined,
                    weightKg: weightKg ? parseFloat(weightKg) : undefined,
                    bmi: currentBmi ? parseFloat(currentBmi) : undefined,
                    bmiHistory: updatedBmiHistory
                } 
            };

            // If there's a new profile picture, include it in the update
            if (previewUrl && previewUrl !== profilePicture && previewUrl.startsWith('data:')) {
                const formData = new FormData();
                formData.append('profilePicture', fileInputRef.current.files[0]);
                
                // Append all other fields to formData
                Object.entries(updateData).forEach(([key, value]) => {
                    if (key === 'healthProfile') {
                        formData.append(key, JSON.stringify(value));
                    } else if (value !== undefined && value !== null) {
                        formData.append(key, value);
                    }
                });

                const response = await api.put('/users/me', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                
                if (updateUser) {
                    updateUser({
                        ...response.data.user,
                        healthProfile: {
                            ...response.data.user.healthProfile,
                            bmi: currentBmi ? parseFloat(currentBmi) : undefined
                        }
                    });
                }
                
                setProfilePicture(response.data.user.profilePicture);
            } else {
                // Regular update without profile picture
                const response = await api.put("/users/me", updateData);
                
                if (updateUser) {
                    updateUser({
                        ...response.data.user,
                        healthProfile: {
                            ...response.data.user.healthProfile,
                            bmi: currentBmi ? parseFloat(currentBmi) : undefined
                        }
                    });
                }
            }

            // Update local state
            setBmi(currentBmi);
            setBmiHistory(updatedBmiHistory);
            setMessage("Profile saved successfully");
            setTimeout(() => setMessage(null), 3000);
            
        } catch (error) {
            console.error("Error saving profile:", error);
            setMessage(error.response?.data?.message || "Error saving profile. Please try again.");
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const currentBmi = calculateBmi(weightKg, heightCm);
    const bmiCategory = getBmiCategory(currentBmi);

    return _jsxs("div", { 
        className: "max-w-4xl mx-auto p-4 space-y-6", 
        children: [
            _jsx("h1", { 
                className: "text-2xl font-semibold text-gray-800 dark:text-white", 
                children: "My Profile" 
            }),
            
            _jsxs("div", {
                className: "flex flex-col items-center mb-6",
                children: [
                    _jsx("div", {
                        className: "relative group",
                        children: _jsxs(_Fragment, {
                            children: [
                                _jsx("div", {
                                    className: "w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg",
                                    onClick: triggerFileInput,
                                    children: previewUrl ? (
                                        _jsx("img", {
                                            src: previewUrl,
                                            alt: "Profile",
                                            className: "w-full h-full object-cover"
                                        })
                                    ) : (
                                        _jsx(FiUser, {
                                            className: "w-16 h-16 text-gray-400"
                                        })
                                    )
                                }),
                                _jsx("div", {
                                    className: "absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors shadow-md",
                                    onClick: (e) => {
                                        e.stopPropagation();
                                        triggerFileInput();
                                    },
                                    children: _jsx(FiUpload, { className: "w-5 h-5" })
                                }),
                                previewUrl && _jsx("button", {
                                    className: "absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600",
                                    onClick: removeProfilePicture,
                                    children: _jsx(FiX, { className: "w-4 h-4" })
                                })
                            ]
                        })
                    }),
                    _jsx("input", {
                        type: "file",
                        ref: fileInputRef,
                        onChange: handleFileChange,
                        accept: "image/*",
                        className: "hidden"
                    }),
                    (previewUrl !== profilePicture) && _jsxs("div", {
                        className: "mt-4 flex gap-2",
                        children: [
                            _jsx("button", {
                                className: "px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2 text-sm",
                                onClick: uploadProfilePicture,
                                disabled: isUploading,
                                children: [
                                    _jsx(FiCheck, { className: "w-4 h-4" }),
                                    isUploading ? "Saving..." : "Save Changes"
                                ]
                            }),
                            _jsx("button", {
                                className: "px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm",
                                onClick: () => {
                                    setPreviewUrl(profilePicture);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                },
                                disabled: isUploading,
                                children: "Cancel"
                            })
                        ]
                    })
                ]
            }),
            
            message && _jsx("div", { 
                className: `p-3 rounded-md ${
                    message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`, 
                children: message 
            }),
            
            _jsxs("div", { 
                className: "grid grid-cols-1 md:grid-cols-2 gap-6", 
                children: [
                    _jsxs("div", { 
                        className: "card p-6 space-y-4", 
                        children: [
                            _jsx("h2", { 
                                className: "text-lg font-medium text-gray-800 dark:text-white", 
                                children: "Personal Information" 
                            }),
                            
                            _jsx("div", { 
                                className: "space-y-3", 
                                children: _jsxs("div", { 
                                    className: "space-y-1", 
                                    children: [
                                        _jsx("label", { 
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300", 
                                            children: "Full Name" 
                                        }),
                                        _jsx("input", { 
                                            type: "text", 
                                            className: "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
                                            value: name,
                                            onChange: (e) => setName(e.target.value),
                                            placeholder: "Enter your full name"
                                        })
                                    ] 
                                })
                            }),
                            
                            _jsx("div", { 
                                className: "grid grid-cols-3 gap-4", 
                                children: [
                                    _jsxs("div", { 
                                        className: "space-y-1", 
                                        children: [
                                            _jsx("label", { 
                                                className: "block text-sm font-medium text-gray-700 dark:text-gray-300", 
                                                children: "Age" 
                                            }),
                                            _jsx("input", { 
                                                type: "number", 
                                                className: "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
                                                value: age,
                                                onChange: (e) => setAge(e.target.value),
                                                placeholder: "Age",
                                                min: "1",
                                                max: "120"
                                            })
                                        ] 
                                    }),
                                    _jsxs("div", { 
                                        className: "space-y-1", 
                                        children: [
                                            _jsx("label", { 
                                                className: "block text-sm font-medium text-gray-700 dark:text-gray-300", 
                                                children: "Height (cm)" 
                                            }),
                                            _jsx("input", { 
                                                type: "number", 
                                                className: "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
                                                value: heightCm,
                                                onChange: (e) => setHeightCm(e.target.value),
                                                placeholder: "Height",
                                                min: "50",
                                                max: "250",
                                                step: "0.1"
                                            })
                                        ] 
                                    }),
                                    _jsxs("div", { 
                                        className: "space-y-1", 
                                        children: [
                                            _jsx("label", { 
                                                className: "block text-sm font-medium text-gray-700 dark:text-gray-300", 
                                                children: "Weight (kg)" 
                                            }),
                                            _jsx("input", { 
                                                type: "number", 
                                                className: "w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
                                                value: weightKg,
                                                onChange: (e) => setWeightKg(e.target.value),
                                                placeholder: "Weight",
                                                min: "1",
                                                max: "300",
                                                step: "0.1"
                                            })
                                        ] 
                                    })
                                ] 
                            }),
                            
                            (currentBmi && !isNaN(currentBmi)) && _jsxs("div", { 
                                className: "mt-4 p-4 rounded-md bg-blue-50 dark:bg-blue-900/30", 
                                children: [
                                    _jsx("h3", { 
                                        className: "font-medium text-gray-800 dark:text-white", 
                                        children: "Your BMI" 
                                    }),
                                    _jsxs("div", { 
                                        className: "flex items-baseline mt-1", 
                                        children: [
                                            _jsx("span", { 
                                                className: "text-3xl font-bold text-primary-600 dark:text-primary-400", 
                                                children: currentBmi 
                                            }),
                                            _jsx("span", { 
                                                className: `ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                                    bmiCategory === "Underweight" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                                                    bmiCategory === "Normal weight" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                                    bmiCategory === "Overweight" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                                    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                }`, 
                                                children: bmiCategory 
                                            })
                                        ] 
                                    })
                                ] 
                            }),
                            
                            _jsx("button", { 
                                onClick: onSave,
                                className: "mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition duration-200",
                                children: "Save Changes" 
                            })
                        ] 
                    }),
                    
                    _jsx("div", { 
                        className: "card p-6", 
                        children: _jsxs("div", { 
                            className: "space-y-4", 
                            children: [
                                _jsx("h2", { 
                                    className: "text-lg font-medium text-gray-800 dark:text-white", 
                                    children: "BMI History" 
                                }),
                                
                                bmiHistory.length > 0 ? _jsx("div", { 
                                    className: "space-y-3", 
                                    children: bmiHistory.map((entry, index) => (
                                        _jsxs("div", { 
                                            className: "p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition", 
                                            children: [
                                                _jsxs("div", { 
                                                    className: "flex justify-between items-center", 
                                                    children: [
                                                        _jsx("span", { 
                                                            className: "font-medium", 
                                                            children: new Date(entry.date).toLocaleDateString() 
                                                        }),
                                                        _jsxs("span", { 
                                                            className: `px-2 py-1 rounded-full text-xs font-medium ${
                                                                entry.bmi < 18.5 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                                                                entry.bmi < 25 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                                                                entry.bmi < 30 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                                                                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                            }`, 
                                                            children: [
                                                                entry.bmi,
                                                                " (", 
                                                                getBmiCategory(entry.bmi), 
                                                                ")"
                                                            ] 
                                                        })
                                                    ] 
                                                }),
                                                _jsx("div", { 
                                                    className: "text-sm text-gray-600 dark:text-gray-400 mt-1", 
                                                    children: `Weight: ${entry.weightKg} kg, Height: ${entry.heightCm} cm` 
                                                })
                                            ] 
                                        }, index)
                                    ))
                                }) : _jsx("p", { 
                                    className: "text-gray-500 text-center py-4", 
                                    children: "No BMI history yet. Save your height and weight to track your BMI over time." 
                                })
                            ] 
                        }) 
                    })
                ] 
            })
        ] 
    });
};
export default Profile;

