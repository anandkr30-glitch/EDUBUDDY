// ==================== IMPORT FIREBASE FROM EXISTING firebase.js ====================

import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ==================== EXPORT FUNCTION FOR ROUTER ====================

export function loadProfile(container) {
  displayProfile(container);
}

// ==================== MAIN PROFILE DISPLAY FUNCTION ====================

function displayProfile(container = null) {
  // Use provided container or default to #view
  container = container || document.getElementById('view') || document.querySelector('main') || document.body;
  
  const user = auth.currentUser;
  
  if (!user) {
    container.innerHTML = '<p>Please log in to view profile</p>';
    return;
  }

  // Get user data from Firestore (using modern v9+ syntax)
  getDoc(doc(db, 'users', user.uid)).then(docSnap => {
    const userData = docSnap.exists() ? docSnap.data() : {};
    
    container.innerHTML = `
      <!-- ==================== PROFILE CONTAINER ==================== -->
      <div class="profile-container">
        
        <!-- HERO SECTION -->
        <div class="profile-hero">
          <div class="profile-hero-content">
            
            <!-- Avatar Section -->
            <div class="profile-avatar-container">
              <div class="profile-avatar-wrapper">
                <div class="profile-avatar-ring">
                  <img 
                    class="profile-avatar" 
                    id="profileImage" 
                    src="${userData.photo || 'https://i.ibb.co/7QpKsCX/user.png'}" 
                    alt="Profile"
                  >
                </div>
                <div class="profile-status"></div>
              </div>
              <button class="change-photo-btn" id="uploadBtn">📸 Change Photo</button>
              <input type="file" id="imageUpload" hidden accept="image/*">
            </div>

            <!-- User Info Section -->
            <div class="profile-info">
              <h1 class="profile-name" id="userName">${userData.name || user.displayName || 'Student'}</h1>
              <p class="profile-email">${user.email}</p>
              
              <div class="profile-stats">
                <div class="stat-item">
                  <span class="stat-label">Quizzes Completed</span>
                  <span class="stat-value" id="quizzesCompleted">${userData.quizzesCompleted || 0}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Current Level</span>
                  <span class="stat-value" id="currentLevel">${Math.floor((userData.xp || 0) / 100) + 1}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Total XP</span>
                  <span class="stat-value" id="totalXP">${userData.xp || 0}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Avg Score</span>
                  <span class="stat-value" id="avgScore">${userData.avgScore || '0'}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TABS -->
        <div class="profile-tabs">
          <button class="profile-tab active" data-tab="basic-info">👤 Basic Info</button>
          <button class="profile-tab" data-tab="academic-details">📚 Academic</button>
          <button class="profile-tab" data-tab="learning-prefs">🎯 Learning</button>
          <button class="profile-tab" data-tab="goals-progress">📊 Goals</button>
        </div>

        <!-- CONTENT SECTIONS -->
        <div class="profile-content">

          <!-- TAB 1: BASIC INFORMATION -->
          <div id="basic-info" class="profile-section active">
            
            <div class="form-section">
              <h3 class="form-section-title">👤 Personal Information</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-input" id="firstName" placeholder="Enter first name" value="${(userData.name || '').split(' ')[0] || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-input" id="lastName" placeholder="Enter last name" value="${(userData.name || '').split(' ')[1] || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-input" id="email" placeholder="Enter email" value="${user.email}" disabled>
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" class="form-input" id="phone" placeholder="Enter phone number" value="${userData.phone || ''}">
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="form-section-title">🏠 Address Information</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">City</label>
                  <input type="text" class="form-input" id="city" placeholder="Enter city" value="${userData.city || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">State/Province</label>
                  <input type="text" class="form-input" id="state" placeholder="Enter state" value="${userData.state || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Country</label>
                  <input type="text" class="form-input" id="country" placeholder="Enter country" value="${userData.country || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Postal Code</label>
                  <input type="text" class="form-input" id="postalCode" placeholder="Enter postal code" value="${userData.postalCode || ''}">
                </div>
              </div>
            </div>

          </div>

          <!-- TAB 2: ACADEMIC DETAILS -->
          <div id="academic-details" class="profile-section">

            <div class="form-section">
              <h3 class="form-section-title">📚 School Information</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Class</label>
                  <input type="text" class="form-input" id="profileClass" placeholder="Enter class" value="${userData.class || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">School/College Name</label>
                  <input type="text" class="form-input" id="schoolName" placeholder="Enter school name" value="${userData.schoolName || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Board</label>
                  <select class="form-select" id="board">
                    <option value="">Select Board</option>
                    <option value="CBSE" ${userData.board === 'CBSE' ? 'selected' : ''}>CBSE</option>
                    <option value="ICSE" ${userData.board === 'ICSE' ? 'selected' : ''}>ICSE</option>
                    <option value="State Board" ${userData.board === 'State Board' ? 'selected' : ''}>State Board</option>
                    <option value="IB" ${userData.board === 'IB' ? 'selected' : ''}>IB</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Roll Number</label>
                  <input type="text" class="form-input" id="rollNumber" placeholder="Enter roll number" value="${userData.rollNumber || ''}">
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="form-section-title">📖 Subjects</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Primary Subject</label>
                  <input type="text" class="form-input" id="profileSubject" placeholder="Enter primary subject" value="${userData.subject || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Secondary Subject</label>
                  <input type="text" class="form-input" id="secondarySubject" placeholder="Enter secondary subject" value="${userData.secondarySubject || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Tertiary Subject</label>
                  <input type="text" class="form-input" id="tertiarySubject" placeholder="Enter tertiary subject" value="${userData.tertiarySubject || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Language</label>
                  <select class="form-select" id="language">
                    <option value="">Select Language</option>
                    <option value="English" ${userData.language === 'English' ? 'selected' : ''}>English</option>
                    <option value="Hindi" ${userData.language === 'Hindi' ? 'selected' : ''}>Hindi</option>
                    <option value="Regional" ${userData.language === 'Regional' ? 'selected' : ''}>Regional</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          <!-- TAB 3: LEARNING PREFERENCES -->
          <div id="learning-prefs" class="profile-section">

            <div class="form-section">
              <h3 class="form-section-title">🎯 Learning Goals</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Learning Goal</label>
                  <textarea class="form-textarea" id="profileGoal" placeholder="Describe your learning goals...">${userData.goal || ''}</textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Daily Study Target (minutes)</label>
                  <input type="number" class="form-input" id="profileTarget" placeholder="Enter minutes per day" value="${userData.target || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Preferred Learning Style</label>
                  <select class="form-select" id="learningStyle">
                    <option value="">Select Style</option>
                    <option value="Visual" ${userData.learningStyle === 'Visual' ? 'selected' : ''}>Visual</option>
                    <option value="Auditory" ${userData.learningStyle === 'Auditory' ? 'selected' : ''}>Auditory</option>
                    <option value="Reading/Writing" ${userData.learningStyle === 'Reading/Writing' ? 'selected' : ''}>Reading/Writing</option>
                    <option value="Kinesthetic" ${userData.learningStyle === 'Kinesthetic' ? 'selected' : ''}>Kinesthetic</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Difficulty Level</label>
                  <select class="form-select" id="difficultyLevel">
                    <option value="">Select Level</option>
                    <option value="Beginner" ${userData.difficultyLevel === 'Beginner' ? 'selected' : ''}>Beginner</option>
                    <option value="Intermediate" ${userData.difficultyLevel === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                    <option value="Advanced" ${userData.difficultyLevel === 'Advanced' ? 'selected' : ''}>Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="form-section-title">🎨 Preferences</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Preferred Language</label>
                  <select class="form-select" id="prefLanguage">
                    <option value="">Select Language</option>
                    <option value="English" ${userData.prefLanguage === 'English' ? 'selected' : ''}>English</option>
                    <option value="Hindi" ${userData.prefLanguage === 'Hindi' ? 'selected' : ''}>Hindi</option>
                    <option value="Regional" ${userData.prefLanguage === 'Regional' ? 'selected' : ''}>Regional</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Notification Frequency</label>
                  <select class="form-select" id="notificationFreq">
                    <option value="">Select Frequency</option>
                    <option value="Daily" ${userData.notificationFreq === 'Daily' ? 'selected' : ''}>Daily</option>
                    <option value="Weekly" ${userData.notificationFreq === 'Weekly' ? 'selected' : ''}>Weekly</option>
                    <option value="Monthly" ${userData.notificationFreq === 'Monthly' ? 'selected' : ''}>Monthly</option>
                    <option value="None" ${userData.notificationFreq === 'None' ? 'selected' : ''}>None</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Time Zone</label>
                  <select class="form-select" id="timezone">
                    <option value="">Select Timezone</option>
                    <option value="IST" ${userData.timezone === 'IST' ? 'selected' : ''}>IST (UTC+5:30)</option>
                    <option value="UTC" ${userData.timezone === 'UTC' ? 'selected' : ''}>UTC</option>
                    <option value="EST" ${userData.timezone === 'EST' ? 'selected' : ''}>EST</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Topics of Interest</label>
                  <input type="text" class="form-input" id="topicsOfInterest" placeholder="e.g., Calculus, Algebra, Physics" value="${userData.topicsOfInterest || ''}">
                </div>
              </div>
            </div>

          </div>

          <!-- TAB 4: GOALS & PROGRESS -->
          <div id="goals-progress" class="profile-section">

            <div class="form-section">
              <h3 class="form-section-title">📊 Performance Goals</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Target Score</label>
                  <input type="number" class="form-input" id="targetScore" min="0" max="100" placeholder="Enter target score %" value="${userData.targetScore || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Target Level</label>
                  <select class="form-select" id="targetLevel">
                    <option value="">Select Target Level</option>
                    <option value="1" ${userData.targetLevel === '1' ? 'selected' : ''}>Level 1</option>
                    <option value="2" ${userData.targetLevel === '2' ? 'selected' : ''}>Level 2</option>
                    <option value="3" ${userData.targetLevel === '3' ? 'selected' : ''}>Level 3</option>
                    <option value="4" ${userData.targetLevel === '4' ? 'selected' : ''}>Level 4</option>
                    <option value="5" ${userData.targetLevel === '5' ? 'selected' : ''}>Level 5</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Exam Date</label>
                  <input type="date" class="form-input" id="examDate" value="${userData.examDate || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Target XP</label>
                  <input type="number" class="form-input" id="targetXP" placeholder="Enter target XP" value="${userData.targetXP || ''}">
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="form-section-title">🏆 Achievements & Milestones</h3>
              <div class="achievements-grid">
                <div class="achievement-card">
                  <div class="achievement-icon">🎯</div>
                  <div class="achievement-title">First Quiz</div>
                </div>
                <div class="achievement-card">
                  <div class="achievement-icon">⭐</div>
                  <div class="achievement-title">Perfect Score</div>
                </div>
                <div class="achievement-card">
                  <div class="achievement-icon">🔥</div>
                  <div class="achievement-title">7-Day Streak</div>
                </div>
                <div class="achievement-card">
                  <div class="achievement-icon">🚀</div>
                  <div class="achievement-title">Level 5</div>
                </div>
                <div class="achievement-card">
                  <div class="achievement-icon">💯</div>
                  <div class="achievement-title">50 Quizzes</div>
                </div>
                <div class="achievement-card">
                  <div class="achievement-icon">👑</div>
                  <div class="achievement-title">Leaderboard</div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="form-section-title">💡 Notes & Reflections</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Personal Notes</label>
                  <textarea class="form-textarea" id="personalNotes" placeholder="Add your personal notes, reflections, or goals...">${userData.personalNotes || ''}</textarea>
                </div>
              </div>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="profile-actions">
              <button class="btn-save" id="saveProfile">💾 Save Changes</button>
              <button class="btn-cancel" id="cancelProfile">✕ Cancel</button>
            </div>

          </div>

        </div>

      </div>
    `;

    // ==================== ATTACH EVENT LISTENERS ====================
    
    // Tab switching
    document.querySelectorAll('.profile-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(tabName).classList.add('active');
      });
    });

    // Profile image upload
    document.getElementById('uploadBtn').addEventListener('click', function() {
      document.getElementById('imageUpload').click();
    });

    document.getElementById('imageUpload').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          document.getElementById('profileImage').src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Save profile button
    document.getElementById('saveProfile').addEventListener('click', async function() {
      try {
        // Collect all form data
        const updatedData = {
          name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
          phone: document.getElementById('phone').value,
          city: document.getElementById('city').value,
          state: document.getElementById('state').value,
          country: document.getElementById('country').value,
          postalCode: document.getElementById('postalCode').value,
          class: document.getElementById('profileClass').value,
          schoolName: document.getElementById('schoolName').value,
          board: document.getElementById('board').value,
          rollNumber: document.getElementById('rollNumber').value,
          subject: document.getElementById('profileSubject').value,
          secondarySubject: document.getElementById('secondarySubject').value,
          tertiarySubject: document.getElementById('tertiarySubject').value,
          language: document.getElementById('language').value,
          goal: document.getElementById('profileGoal').value,
          target: document.getElementById('profileTarget').value,
          learningStyle: document.getElementById('learningStyle').value,
          difficultyLevel: document.getElementById('difficultyLevel').value,
          prefLanguage: document.getElementById('prefLanguage').value,
          notificationFreq: document.getElementById('notificationFreq').value,
          timezone: document.getElementById('timezone').value,
          topicsOfInterest: document.getElementById('topicsOfInterest').value,
          targetScore: document.getElementById('targetScore').value,
          targetLevel: document.getElementById('targetLevel').value,
          examDate: document.getElementById('examDate').value,
          targetXP: document.getElementById('targetXP').value,
          personalNotes: document.getElementById('personalNotes').value,
        };

        // Update Firestore using modern v9+ syntax
        await updateDoc(doc(db, 'users', user.uid), updatedData);
        
        // Show success message
        alert('✅ Profile updated successfully!');
        
        // Reload profile
        displayProfile(container);
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('❌ Error updating profile: ' + error.message);
      }
    });

    // Cancel button
    document.getElementById('cancelProfile').addEventListener('click', function() {
      window.history.back();
    });

  }).catch(error => {
    console.error('Error fetching profile:', error);
    container.innerHTML = '<p>Error loading profile. Please try again.</p>';
  });
}