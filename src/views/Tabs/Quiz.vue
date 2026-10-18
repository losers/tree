<template>
  <div class="quiz-container" :class="isDark ? 'theme-dark' : 'theme-light'">
    <!-- ==================== 1. SETUP STATE ==================== -->
    <div v-if="gameState === 'setup'" class="setup-wrapper">
      <div class="glass-card setup-card">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div class="d-flex align-items-center">
            <div class="icon-circle mr-3">🧠</div>
            <div>
              <h3 class="font-weight-bold mb-1 title-text">Family Quiz</h3>
              <p class="text-muted mb-0 small">Test your knowledge of family heritage & kinship</p>
            </div>
          </div>
        </div>

        <!-- Tree Loading Spinner -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <div class="mt-2 text-muted">Analyzing family tree...</div>
        </div>

        <div v-else>
          <!-- Warning Banner: SHOWN ONLY IF TREE HAS < 10 MEMBERS -->
          <div v-if="!canPlay" class="status-banner banner-warning mb-4">
            <div class="banner-circle">{{ memberCount }}</div>
            <div class="banner-content">
              <h6 class="font-weight-bold mb-1">Tree Too Small for Quiz</h6>
              <p class="mb-0 small">
                At least <strong>10 members</strong> are required to generate questions. Currently you have {{ memberCount }}.
              </p>
            </div>
            <div class="banner-action">
              <button
                v-if="!useDemo"
                class="btn btn-sm btn-light font-weight-bold"
                @click="enableDemoFamily"
              >
                🌟 Try Demo Family
              </button>
            </div>
          </div>

          <!-- Demo active notification bar -->
          <div v-if="useDemo" class="demo-notice-bar d-flex align-items-center justify-content-between mb-3 px-3 py-2 rounded">
            <span class="small font-weight-bold text-primary">🌟 Currently using Sterling Dynasty Demo Family</span>
            <button class="btn btn-sm btn-outline-primary" @click="disableDemoFamily">
              Use My Tree
            </button>
          </div>

          <!-- Difficulty Mode Selection (Easy 10+, Med 20+, Hard 30+) -->
          <div class="mt-3">
            <label class="font-weight-bold text-uppercase section-label">
              Select Difficulty Mode
            </label>
            <div class="row mt-2">
              <div
                v-for="mode in modes"
                :key="mode.id"
                class="col-12 col-md-4 mb-3"
              >
                <div
                  :class="[
                    'mode-card',
                    { active: selectedDifficulty === mode.id, locked: memberCount < mode.requiredSize }
                  ]"
                  @click="selectMode(mode)"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="mode-emoji">{{ mode.emoji }}</span>
                    <span v-if="memberCount < mode.requiredSize" class="badge badge-secondary p-1">
                      <i class="icofont-lock"></i> Needs {{ mode.requiredSize }}
                    </span>
                    <i v-else-if="selectedDifficulty === mode.id" class="icofont-check-circled text-primary"></i>
                  </div>
                  <h6 class="font-weight-bold mt-2 mb-1">{{ mode.name }}</h6>
                  <p class="text-muted small mb-0">{{ mode.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Number of Questions Picker -->
          <div class="mt-3">
            <label class="font-weight-bold text-uppercase section-label">
              Number of Questions
            </label>
            <div class="d-flex count-pills mt-2">
              <button
                v-for="c in [5, 10, 15, 20]"
                :key="c"
                :class="['btn', 'count-btn', { active: selectedCount === c }]"
                @click="selectedCount = c"
              >
                {{ c }} Questions
              </button>
            </div>
          </div>

          <!-- Start Button -->
          <button
            class="btn btn-primary btn-block btn-lg mt-4 start-btn"
            :disabled="!canPlay"
            @click="startQuiz"
          >
            <i class="icofont-play mr-2"></i> Start Family Quiz
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== 2. ACTIVE PLAYING STATE ==================== -->
    <div v-else-if="gameState === 'play'" class="play-wrapper">
      <div class="glass-card play-card">
        <!-- Top Info Header -->
        <div class="d-flex align-items-center justify-content-between mb-2">
          <button class="btn btn-sm btn-link text-muted p-0" @click="confirmQuit">
            <i class="icofont-close-line font-weight-bold" style="font-size: 20px;"></i>
          </button>

          <!-- Streak Pill -->
          <div v-if="streak >= 2" class="streak-pill animate__animated animate__bounceIn">
            🔥 {{ streak }} in a row!
          </div>

          <!-- Score -->
          <div class="score-badge">
            <i class="icofont-star text-warning mr-1"></i> {{ score }} pts
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress mb-3 custom-progress">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{ width: ((currentIndex + 1) / questions.length) * 100 + '%' }"
          ></div>
        </div>

        <div class="d-flex justify-content-between text-muted small mb-3">
          <span>Question {{ currentIndex + 1 }} of {{ questions.length }}</span>
          <span class="badge badge-primary px-2 py-1 text-uppercase">{{ currentQuestion.category }}</span>
        </div>

        <!-- Photo Banner (if available for candidate) -->
        <div v-if="currentQuestion.photo" class="photo-banner mb-3">
          <img :src="'data:image/jpeg;base64,' + currentQuestion.photo" class="candidate-img" alt="Member Photo" />
        </div>

        <!-- Question Prompt -->
        <h4 class="font-weight-bold question-text mb-4">
          {{ currentQuestion.text }}
        </h4>

        <!-- Options List (Multiple Choice or True/False) -->
        <div class="options-grid">
          <div
            v-for="(optionText, idx) in currentQuestion.options"
            :key="idx"
            :class="getOptionClass(idx)"
            @click="onSelectOption(idx)"
          >
            <div class="option-prefix">{{ getOptionLetter(idx) }}</div>
            <div class="option-label">{{ optionText }}</div>
            <div class="option-icon">
              <i v-if="isAnswered && idx === currentQuestion.correctIndex" class="icofont-check-circled text-success"></i>
              <i v-else-if="isAnswered && selectedIndex === idx && idx !== currentQuestion.correctIndex" class="icofont-close-circled text-danger"></i>
            </div>
          </div>
        </div>

        <!-- Immediate Feedback Banner -->
        <div v-if="isAnswered" :class="['feedback-banner mt-4', isCurrentCorrect ? 'fb-correct' : 'fb-wrong']">
          <div class="fb-icon">
            <i :class="isCurrentCorrect ? 'icofont-check-circled' : 'icofont-info-circle'"></i>
          </div>
          <div>
            <div class="font-weight-bold">
              {{ isCurrentCorrect ? 'Awesome! That is Correct! 🎉' : 'Oops, not quite! 💡' }}
            </div>
            <div class="small">
              {{ isCurrentCorrect ? 'Great job! Keep the momentum going.' : 'Correct answer: ' + currentQuestion.options[currentQuestion.correctIndex] }}
            </div>
          </div>
        </div>

        <!-- Next / Finish Button -->
        <button
          v-if="isAnswered"
          class="btn btn-primary btn-block btn-lg mt-4 next-btn"
          @click="nextQuestion"
        >
          <span>{{ currentIndex === questions.length - 1 ? 'View Report 📊' : 'Next Question ➔' }}</span>
        </button>
      </div>
    </div>

    <!-- ==================== 3. DETAILED REPORT STATE ==================== -->
    <div v-else-if="gameState === 'report'" class="report-wrapper">
      <div class="report-container" @click="handleReportClick($event)">
        <!-- Top Action Buttons -->
        <div class="d-flex justify-content-between mb-3">
          <button class="btn btn-primary flex-grow-1 mr-2 action-btn shadow-sm" :disabled="downloading" @click="downloadReport">
            <i :class="downloading ? 'icofont-spinner icofont-spin' : 'icofont-file-pdf'" class="mr-1"></i>
            {{ downloading ? 'Generating PDF...' : 'Download Report (PDF)' }}
          </button>
          <button class="btn btn-outline-primary flex-grow-1 ml-2 action-btn shadow-sm" @click="restartSetup">
            <i class="icofont-refresh mr-1"></i> Play Again
          </button>
        </div>

        <!-- Visible Scorecard & Breakdown Container for PDF Export -->
        <div id="quiz-full-report" class="quiz-export-container">
          <!-- Branding Header -->
          <div class="pdf-branding-header text-center mb-3">
            <h3 class="font-weight-bold mb-1 brand-title">Bloodline Family Quiz Report</h3>
            <p class="brand-subtitle small mb-0">{{ activeTreeTitle }} • {{ selectedDifficulty.toUpperCase() }} MODE</p>
          </div>

          <!-- Scorecard Banner -->
          <div id="quiz-scorecard" class="scorecard-banner">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="badge badge-light text-uppercase font-weight-bold px-3 py-1">
                {{ selectedDifficulty }} MODE
              </span>
              <span class="text-white-50 small font-weight-bold">BLOODLINE QUIZ</span>
            </div>

            <div class="text-center my-3">
              <div class="badge-emoji">{{ reportBadge.emoji }}</div>
              <h2 class="text-white font-weight-bold mb-1">{{ reportBadge.title }}</h2>
              <div class="text-white-50">{{ activeTreeTitle }}</div>
            </div>

            <div class="stats-box mt-4">
              <div class="stat-col">
                <div class="stat-num">{{ correctCount }} / {{ questions.length }}</div>
                <div class="stat-lbl">SCORE</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-col">
                <div class="stat-num">{{ accuracyPercent }}%</div>
                <div class="stat-lbl">ACCURACY</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-col">
                <div class="stat-num">{{ formattedDuration }}</div>
                <div class="stat-lbl">TIME</div>
              </div>
            </div>
          </div>

          <!-- Question Breakdown Review List -->
          <div class="mt-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="font-weight-bold mb-0 breakdown-title">
                <i class="icofont-listine-dots text-primary mr-1"></i> Question Breakdown
              </h5>
              <span class="badge badge-success px-2 py-1">{{ correctCount }} Correct</span>
            </div>

            <div
              v-for="(rev, idx) in reviews"
              :key="idx"
              :class="['review-card mb-3', rev.isCorrect ? 'rev-correct' : 'rev-wrong']"
            >
              <div class="d-flex align-items-start">
                <div :class="['rev-icon mr-3', rev.isCorrect ? 'text-success' : 'text-danger']">
                  <i :class="rev.isCorrect ? 'icofont-check-circled' : 'icofont-close-circled'"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between">
                    <span class="font-weight-bold small text-muted">Q{{ idx + 1 }} • {{ rev.question.category }}</span>
                    <span v-if="rev.isCorrect" class="badge badge-success">Correct</span>
                    <span v-else class="badge badge-danger">Wrong</span>
                  </div>

                  <!-- Question Text with clickable person links -->
                  <h6 class="font-weight-bold mt-1 mb-2 rev-question-title" v-html="formatWithPersonLinks(rev.question.text, rev)"></h6>

                  <div class="small">
                    <div>
                      <span class="text-muted answer-label">Your Pick: </span>
                      <strong :class="rev.isCorrect ? 'text-success answer-val-correct' : 'text-danger answer-val-wrong'" v-html="formatWithPersonLinks(rev.selectedAnswer, rev)"></strong>
                    </div>
                    <div v-if="!rev.isCorrect" class="mt-1">
                      <span class="text-muted answer-label">Correct: </span>
                      <strong class="text-success answer-val-correct" v-html="formatWithPersonLinks(rev.correctAnswer, rev)"></strong>
                    </div>
                  </div>

                  <!-- Factual Kinship Explanation -->
                  <div v-if="rev.explanationText" class="explanation-box mt-3">
                    <div class="d-flex align-items-center mb-1 font-weight-bold small explanation-header">
                      <i class="icofont-info-circle mr-1"></i> Explanation
                    </div>
                    <div class="explanation-text small" v-html="formatWithPersonLinks(rev.explanationText, rev)"></div>
                  </div>

                  <!-- Dedicated Clickable Person Profile Chips -->
                  <div v-if="getPersonsForReview(rev).length" class="person-chips-row mt-3">
                    <span class="chips-label small text-muted mr-2 font-weight-bold">View Profile:</span>
                    <button
                      v-for="p in getPersonsForReview(rev)"
                      :key="p.id"
                      class="btn btn-sm person-chip-btn mr-2 mb-1"
                      @click="openPersonProfile(p.id)"
                      title="Click to view full profile details"
                    >
                      <i class="icofont-user-alt-5 mr-1 text-primary"></i>
                      <span>{{ p.name }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Action Buttons for mobile convenience -->
        <div class="d-flex justify-content-between mt-4">
          <button class="btn btn-primary flex-grow-1 mr-2 action-btn shadow-sm" :disabled="downloading" @click="downloadReport">
            <i :class="downloading ? 'icofont-spinner icofont-spin' : 'icofont-file-pdf'" class="mr-1"></i>
            {{ downloading ? 'Generating PDF...' : 'Download Report (PDF)' }}
          </button>
          <button class="btn btn-outline-primary flex-grow-1 ml-2 action-btn shadow-sm" @click="restartSetup">
            <i class="icofont-refresh mr-1"></i> Play Again
          </button>
        </div>
      </div>
    </div>

    <!-- Person Profile View Drawer (on same page) -->
    <MemberData
      v-if="selectedMemberId"
      :key="selectedMemberId"
      :member-id="selectedMemberId"
      @close="selectedMemberId = null"
    />
  </div>
</template>

<script>
import Axios from 'axios';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import Store from '@/store/index';
import ProdData from '@/data.js';
import { KinshipGraph } from '@/util/quiz-kinship.js';
import { QuizGenerator } from '@/util/quiz-generator.js';
import { demoFamilyTree, demoMemberDetails } from '@/util/quiz-demo-data.js';
import MemberData from '@/components/MemberData/MemberData.vue';

export default {
  name: 'Quiz',
  components: {
    MemberData
  },
  data() {
    return {
      gameState: 'setup', // 'setup', 'play', 'report'
      loading: true,
      useDemo: false,
      graph: null,
      generator: null,
      memberCount: 0,
      activeTreeTitle: 'Family',

      // Setup parameters
      selectedDifficulty: 'easy',
      selectedCount: 10,
      modes: [
        { id: 'easy', name: 'Easy Mode', emoji: '🌱', requiredSize: 10, desc: 'Direct kinship, parent/child, spouses & photo ID.' },
        { id: 'medium', name: 'Medium Mode', emoji: '🌿', requiredSize: 20, desc: 'Grandparents, uncles/aunts, birthdays & age trivia.' },
        { id: 'hard', name: 'Hard Mode', emoji: '🌳', requiredSize: 30, desc: 'Cousins, in-laws, great-grandparents & multi-generational kinship.' }
      ],

      // Active Quiz State
      questions: [],
      currentIndex: 0,
      selectedIndex: null,
      isAnswered: false,
      isCurrentCorrect: false,
      score: 0,
      streak: 0,
      startTime: null,
      durationSeconds: 0,
      reviews: [],

      // Report state
      downloading: false,
      selectedMemberId: null
    };
  },
  computed: {
    isDark() {
      return Store.getters.getTheme === 'dark';
    },
    canPlay() {
      return this.memberCount >= 10;
    },
    currentQuestion() {
      return this.questions[this.currentIndex] || {};
    },
    correctCount() {
      return this.reviews.filter(r => r.isCorrect).length;
    },
    accuracyPercent() {
      if (this.questions.length === 0) return 0;
      return Math.round((this.correctCount / this.questions.length) * 100);
    },
    formattedDuration() {
      const mins = Math.floor(this.durationSeconds / 60);
      const secs = this.durationSeconds % 60;
      return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    },
    reportBadge() {
      const p = this.accuracyPercent;
      if (p === 100) return { emoji: '👑', title: 'Family Legend' };
      if (p >= 80) return { emoji: '🌟', title: 'Kinship Master' };
      if (p >= 60) return { emoji: '🌳', title: 'Family Historian' };
      if (p >= 40) return { emoji: '🌱', title: 'Tree Explorer' };
      return { emoji: '🐣', title: 'Kinship Learner' };
    }
  },
  mounted() {
    this.initTreeData();
  },
  beforeDestroy() {
    if (this.$confetti) {
      this.$confetti.stop();
    }
  },
  methods: {
    async initTreeData() {
      this.loading = true;
      const surname = this.$route.params.id;

      try {
        const res = await Axios.get(ProdData.getHostURL() + `/tree/${surname}/quiz-data`);
        if (res.data && res.data.tree) {
          const treeData = res.data.tree;
          const membersList = res.data.members || [];
          const images = res.data.images || Store.state.images || {};
          this.activeTreeTitle = (res.data.meta && res.data.meta.title) || Store.state.title || `${surname} Family`;

          this.graph = new KinshipGraph(treeData, membersList, images);
          this.memberCount = this.graph.members.length;
          this.generator = new QuizGenerator(this.graph, this.activeTreeTitle);
        } else {
          this.fallbackToStoreTree(surname);
        }
      } catch (err) {
        this.fallbackToStoreTree(surname);
      } finally {
        this.autoAdjustMode();
        this.loading = false;
      }
    },

    fallbackToStoreTree(surname) {
      const storeTree = Store.state.tree;
      if (storeTree && (storeTree.id || storeTree.name)) {
        this.graph = new KinshipGraph(storeTree, [], Store.state.images || {});
        this.memberCount = this.graph.members.length;
        this.activeTreeTitle = Store.state.title || `${surname} Family`;
        this.generator = new QuizGenerator(this.graph, this.activeTreeTitle);
      } else {
        this.enableDemoFamily();
      }
    },

    enableDemoFamily() {
      this.useDemo = true;
      this.graph = new KinshipGraph(demoFamilyTree, demoMemberDetails, {});
      this.memberCount = this.graph.members.length;
      this.activeTreeTitle = 'Sterling Dynasty (Demo)';
      this.generator = new QuizGenerator(this.graph, this.activeTreeTitle);
      this.autoAdjustMode();
    },

    disableDemoFamily() {
      this.useDemo = false;
      this.initTreeData();
    },

    autoAdjustMode() {
      if (this.memberCount < 20 && this.selectedDifficulty === 'medium') {
        this.selectedDifficulty = 'easy';
      }
      if (this.memberCount < 30 && this.selectedDifficulty === 'hard') {
        this.selectedDifficulty = this.memberCount >= 20 ? 'medium' : 'easy';
      }
    },

    selectMode(mode) {
      if (this.memberCount < mode.requiredSize) {
        alert(`${mode.name} requires at least ${mode.requiredSize} members. Your tree currently has ${this.memberCount}.`);
        return;
      }
      this.selectedDifficulty = mode.id;
    },

    startQuiz() {
      if (!this.generator) return;
      this.questions = this.generator.generateQuiz(this.selectedDifficulty, this.selectedCount);
      if (this.questions.length === 0) {
        alert('Could not generate enough questions. Try adding more members or playing in Easy mode.');
        return;
      }
      this.currentIndex = 0;
      this.selectedIndex = null;
      this.isAnswered = false;
      this.score = 0;
      this.streak = 0;
      this.reviews = [];
      this.startTime = new Date();
      this.gameState = 'play';
    },

    getOptionLetter(idx) {
      const letters = ['A', 'B', 'C', 'D'];
      return letters[idx] || (idx + 1);
    },

    getOptionClass(idx) {
      if (!this.isAnswered) {
        return ['option-card', { selected: this.selectedIndex === idx }];
      }
      const isCorrectOption = idx === this.currentQuestion.correctIndex;
      const isUserChoice = idx === this.selectedIndex;

      if (isCorrectOption) {
        return 'option-card opt-correct';
      } else if (isUserChoice) {
        return 'option-card opt-wrong';
      }
      return 'option-card opt-dimmed';
    },

    onSelectOption(idx) {
      if (this.isAnswered) return;

      this.selectedIndex = idx;
      this.isAnswered = true;
      const isCorrect = idx === this.currentQuestion.correctIndex;
      this.isCurrentCorrect = isCorrect;

      if (isCorrect) {
        this.score += 10 + (this.streak * 2);
        this.streak++;
        if (this.$confetti) {
          this.$confetti.start({ particles: [{ type: 'circle', size: 6 }], defaultColors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'] });
          setTimeout(() => this.$confetti.stop(), 900);
        }
      } else {
        this.streak = 0;
      }

      const explanation = this.currentQuestion.context?.kinshipExplanation
        || (isCorrect
          ? 'Great job! You know your family well.'
          : `The correct answer is ${this.currentQuestion.options[this.currentQuestion.correctIndex]}.`);

      this.reviews.push({
        question: this.currentQuestion,
        questionText: this.currentQuestion.text,
        selectedAnswer: this.currentQuestion.options[idx],
        correctAnswer: this.currentQuestion.options[this.currentQuestion.correctIndex],
        isCorrect,
        context: this.currentQuestion.context,
        explanationText: explanation
      });
    },

    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.selectedIndex = null;
        this.isAnswered = false;
      } else {
        this.finishQuiz();
      }
    },

    confirmQuit() {
      if (confirm('Are you sure you want to exit the quiz? Current progress will be lost.')) {
        this.gameState = 'setup';
      }
    },

    finishQuiz() {
      this.durationSeconds = Math.round((new Date() - this.startTime) / 1000);
      this.gameState = 'report';

      if (this.accuracyPercent >= 60 && this.$confetti) {
        this.$confetti.start({ defaultColors: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#38bdf8'] });
        setTimeout(() => this.$confetti.stop(), 2500);
      }
    },

    openPersonProfile(personId) {
      if (!personId) return;
      this.selectedMemberId = String(personId);
    },

    handleReportClick(event) {
      const link = event.target.closest('.person-ref-link');
      if (link && link.dataset.personId) {
        this.openPersonProfile(link.dataset.personId);
      }
    },

    getPersonsForReview(rev) {
      if (!rev || !this.graph) return [];
      const persons = [];
      const seenIds = new Set();
      const ctx = rev.context || {};

      const addIfMember = (id, fallbackName) => {
        if (!id || seenIds.has(id)) return;
        seenIds.add(id);
        const m = this.graph.getMember(id);
        if (m) {
          persons.push({ id: m.id, name: this.graph.getName(m) });
        } else if (fallbackName) {
          persons.push({ id, name: fallbackName });
        }
      };

      if (ctx.personAId) addIfMember(ctx.personAId, ctx.personA);
      if (ctx.personBId) addIfMember(ctx.personBId, ctx.personB);
      if (ctx.actualSpouseId) addIfMember(ctx.actualSpouseId, ctx.actualSpouse);

      // If IDs were not explicitly on context, look up by name in graph
      if (persons.length === 0 && this.graph.members) {
        const textToCheck = `${rev.question?.text || ''} ${rev.selectedAnswer || ''} ${rev.correctAnswer || ''}`;
        this.graph.members.forEach(m => {
          if (seenIds.has(m.id)) return;
          const sName = m.short_name;
          const fName = m.name;
          if ((sName && sName.length >= 2 && textToCheck.includes(sName)) || (fName && fName.length >= 2 && textToCheck.includes(fName))) {
            seenIds.add(m.id);
            persons.push({ id: m.id, name: this.graph.getName(m) });
          }
        });
      }

      return persons;
    },

    formatWithPersonLinks(text, rev = null) {
      if (!text || typeof text !== 'string') return text || '';
      if (!this.graph || !this.graph.members || this.graph.members.length === 0) return text;

      // 1. Gather members specifically involved in this review question first
      const specificMembers = [];
      const specificIds = new Set();
      const addSpecific = (id) => {
        if (!id || specificIds.has(id)) return;
        specificIds.add(id);
        const m = this.graph.getMember(id);
        if (m) specificMembers.push(m);
      };

      if (rev && rev.context) {
        if (rev.context.personAId) addSpecific(rev.context.personAId);
        if (rev.context.personBId) addSpecific(rev.context.personBId);
        if (rev.context.actualSpouseId) addSpecific(rev.context.actualSpouseId);
      }

      // 2. Members list: specific members first, then other members
      const membersToSearch = [
        ...specificMembers,
        ...this.graph.members.filter(m => !specificIds.has(m.id))
      ];

      const mentions = [];
      membersToSearch.forEach(m => {
        const isSpecific = specificIds.has(m.id);
        const dName = m.displayName ? m.displayName.trim() : '';
        const fName = m.name ? m.name.trim() : '';
        const sName = m.short_name ? m.short_name.trim() : '';

        // Test name variations from longest to shortest
        const names = Array.from(new Set([dName, fName, sName].filter(n => n && n.length >= 2)));
        names.sort((a, b) => b.length - a.length);

        names.forEach(name => {
          const escaped = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
          const regex = new RegExp(`(?<![a-zA-Z0-9_])(${escaped})(?![a-zA-Z0-9_])`, 'gi');
          let match;
          while ((match = regex.exec(text)) !== null) {
            mentions.push({
              start: match.index,
              end: match.index + match[0].length,
              name: match[0],
              id: m.id,
              isSpecific
            });
          }
        });
      });

      if (mentions.length === 0) return text;

      // Filter overlapping mentions:
      // Prioritize specific members of this question, then longer matched substrings
      mentions.sort((a, b) => {
        if (a.isSpecific && !b.isSpecific) return -1;
        if (!a.isSpecific && b.isSpecific) return 1;
        return (b.end - b.start) - (a.end - a.start) || a.start - b.start;
      });

      const nonOverlapping = [];
      for (const m of mentions) {
        const overlaps = nonOverlapping.some(o => !(m.end <= o.start || m.start >= o.end));
        if (!overlaps) {
          nonOverlapping.push(m);
        }
      }

      nonOverlapping.sort((a, b) => a.start - b.start);

      let result = '';
      let cursor = 0;
      for (const m of nonOverlapping) {
        result += text.slice(cursor, m.start);
        result += `<span class="person-ref-link" data-person-id="${m.id}" title="Click to view profile">${m.name}</span>`;
        cursor = m.end;
      }
      result += text.slice(cursor);
      return result;
    },

    async downloadReport() {
      const reportElement = document.getElementById('quiz-full-report');
      if (!reportElement) return;
      this.downloading = true;

      try {
        const isDarkMode = this.isDark;
        const bg = isDarkMode ? '#0f172a' : '#ffffff';

        const dataUrl = await htmlToImage.toPng(reportElement, {
          quality: 0.98,
          pixelRatio: 2,
          backgroundColor: bg
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = pdfHeight;
        let position = 0;

        if (isDarkMode) {
          pdf.setFillColor(15, 23, 42); // #0f172a
          pdf.rect(0, 0, pdfWidth, pageHeight, 'F');
        }

        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          if (isDarkMode) {
            pdf.setFillColor(15, 23, 42); // #0f172a
            pdf.rect(0, 0, pdfWidth, pageHeight, 'F');
          }
          pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }

        const familySlug = this.$route.params.id || 'family';
        pdf.save(`bloodline_quiz_report_${familySlug}.pdf`);
      } catch (err) {
        console.error('PDF generation error:', err);
      } finally {
        this.downloading = false;
      }
    },

    restartSetup() {
      this.gameState = 'setup';
      this.currentIndex = 0;
      this.selectedIndex = null;
      this.isAnswered = false;
      this.reviews = [];
    }
  }
};
</script>

<style scoped>
.quiz-container {
  min-height: calc(100vh - 120px);
  padding: 20px 16px 60px;
  display: flex;
  justify-content: center;
}

/* Glass card container */
.glass-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
  width: 100%;
}
.theme-dark .glass-card {
  background: rgba(30, 41, 59, 0.92);
  border-color: rgba(51, 65, 85, 0.8);
  color: #f8fafc;
}

.setup-wrapper, .play-wrapper, .report-wrapper {
  width: 100%;
  max-width: 680px;
}

.setup-card, .play-card {
  padding: 32px;
}

.icon-circle {
  font-size: 36px;
  line-height: 1;
}

.title-text {
  color: #4f46e5;
}
.theme-dark .title-text {
  color: #818cf8;
}

/* Status Banner */
.status-banner {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: 18px;
  color: white;
}
.banner-warning {
  background: linear-gradient(135deg, #d97706, #f59e0b);
}
.banner-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  margin-right: 16px;
  flex-shrink: 0;
}
.banner-content {
  flex-grow: 1;
}

.demo-notice-bar {
  background: rgba(79, 70, 229, 0.1);
  border: 1px dashed rgba(79, 70, 229, 0.4);
}

.section-label {
  font-size: 12px;
  letter-spacing: 0.8px;
  color: #64748b;
}

/* Mode cards */
.mode-card {
  padding: 16px;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 100%;
}
.theme-dark .mode-card {
  background: #0f172a;
  border-color: #334155;
}
.mode-card:hover {
  transform: translateY(-2px);
  border-color: #6366f1;
}
.mode-card.active {
  border-color: #4f46e5;
  background: rgba(99, 102, 241, 0.08);
}
.mode-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}
.mode-emoji {
  font-size: 26px;
}

/* Count pills */
.count-pills {
  gap: 8px;
  flex-wrap: wrap;
}
.count-btn {
  flex: 1;
  min-width: 90px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  border-radius: 12px;
  font-weight: 700;
  color: #334155;
  padding: 10px 4px;
  font-size: 13px;
  transition: all 0.2s;
}
.theme-dark .count-btn {
  background: #0f172a;
  border-color: #334155;
  color: #cbd5e1;
}
.count-btn.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

/* Start button */
.start-btn {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  border: none;
  border-radius: 16px;
  font-weight: 800;
  padding: 14px;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
}

/* Play Screen styles */
.custom-progress {
  height: 8px;
  border-radius: 6px;
  background: #e2e8f0;
}
.theme-dark .custom-progress {
  background: #334155;
}
.custom-progress .progress-bar {
  background: #6366f1;
  border-radius: 6px;
  transition: width 0.3s;
}

.streak-pill {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: white;
  font-weight: 800;
  font-size: 13px;
  padding: 4px 14px;
  border-radius: 20px;
}

.score-badge {
  font-weight: 800;
  font-size: 14px;
}

.photo-banner {
  text-align: center;
  background: #0f172a;
  border-radius: 18px;
  padding: 8px;
  overflow: hidden;
}
.candidate-img {
  max-height: 220px;
  max-width: 100%;
  border-radius: 14px;
  object-fit: cover;
}

.question-text {
  line-height: 1.4;
}

/* Options */
.options-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.option-card {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}
.theme-dark .option-card {
  background: #0f172a;
  border-color: #334155;
}
.option-card:hover {
  border-color: #818cf8;
}
.option-prefix {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #4f46e5;
  margin-right: 14px;
  flex-shrink: 0;
}
.theme-dark .option-prefix {
  color: #818cf8;
}
.option-label {
  flex-grow: 1;
  font-weight: 600;
  font-size: 15px;
}
.option-icon {
  font-size: 22px;
}

.option-card.opt-correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.12);
}
.option-card.opt-wrong {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.12);
}
.option-card.opt-dimmed {
  opacity: 0.5;
  cursor: default;
}

/* Feedback banner */
.feedback-banner {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-radius: 16px;
}
.fb-correct {
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid #10b981;
  color: #065f46;
}
.theme-dark .fb-correct {
  color: #6ee7b7;
}
.fb-wrong {
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid #ef4444;
  color: #991b1b;
}
.theme-dark .fb-wrong {
  color: #fca5a5;
}
.fb-icon {
  font-size: 26px;
  margin-right: 14px;
  flex-shrink: 0;
}

.next-btn {
  background: #4f46e5;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  padding: 14px;
}

/* Report Styles */
.quiz-export-container {
  border-radius: 20px;
  padding: 18px;
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
.theme-dark .quiz-export-container {
  background: #0f172a;
  color: #f8fafc;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.pdf-branding-header {
  display: block;
}
.brand-title {
  color: #1e293b;
}
.theme-dark .brand-title {
  color: #f8fafc;
}
.brand-subtitle {
  color: #64748b;
}
.theme-dark .brand-subtitle {
  color: #94a3b8;
}

.scorecard-banner {
  background: linear-gradient(135deg, #4f46e5, #7c3aed, #db2777);
  border-radius: 24px;
  padding: 28px;
  color: white;
  box-shadow: 0 14px 34px rgba(79, 70, 229, 0.35);
}
.badge-emoji {
  font-size: 52px;
}
.stats-box {
  background: rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 14px;
}
.stat-col {
  text-align: center;
}
.stat-num {
  font-weight: 900;
  font-size: 20px;
}
.stat-lbl {
  font-size: 11px;
  opacity: 0.75;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
}

.action-btn {
  border-radius: 14px;
  font-weight: 700;
  padding: 12px;
}

.breakdown-title {
  color: #0f172a;
}
.theme-dark .breakdown-title {
  color: #f8fafc;
}

/* Review cards */
.review-card {
  padding: 18px;
  border-radius: 18px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  page-break-inside: avoid;
}
.theme-dark .review-card {
  background: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}
.rev-correct {
  border-color: rgba(16, 185, 129, 0.5);
}
.rev-wrong {
  border-color: rgba(239, 68, 68, 0.5);
}
.rev-icon {
  font-size: 24px;
}
.rev-question-title {
  color: #0f172a;
  line-height: 1.4;
}
.theme-dark .rev-question-title {
  color: #f8fafc;
}

.answer-label {
  color: #64748b;
  font-weight: 600;
}
.theme-dark .answer-label {
  color: #94a3b8;
}
.answer-val-correct {
  color: #059669;
}
.theme-dark .answer-val-correct {
  color: #34d399;
}
.answer-val-wrong {
  color: #dc2626;
}
.theme-dark .answer-val-wrong {
  color: #f87171;
}

/* Explanation Box */
.explanation-box {
  background: #eef2ff;
  border: 1.5px solid #c7d2fe;
  border-radius: 14px;
  padding: 12px 14px;
}
.theme-dark .explanation-box {
  background: rgba(30, 27, 75, 0.65);
  border-color: rgba(99, 102, 241, 0.45);
}
.explanation-header {
  color: #4338ca;
  font-weight: 700;
}
.theme-dark .explanation-header {
  color: #a5b4fc;
}
.explanation-text {
  line-height: 1.5;
  color: #1e293b;
  font-weight: 500;
}
.theme-dark .explanation-text {
  color: #f1f5f9;
}

/* Clickable Person Links */
::v-deep .person-ref-link {
  color: #3730a3;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: pointer;
  padding: 1px 6px;
  border-radius: 4px;
  background: #e0e7ff;
  transition: all 0.15s ease;
  display: inline-block;
}
::v-deep .person-ref-link:hover {
  background: #c7d2fe;
  color: #1e1b4b;
}
.theme-dark ::v-deep .person-ref-link {
  color: #93c5fd;
  background: rgba(30, 58, 138, 0.55);
}
.theme-dark ::v-deep .person-ref-link:hover {
  background: rgba(59, 130, 246, 0.4);
  color: #ffffff;
}

/* Dedicated Person Chips Row */
.person-chips-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  border-top: 1px dashed #cbd5e1;
  padding-top: 10px;
}
.theme-dark .person-chips-row {
  border-top-color: #334155;
}
.chips-label {
  color: #64748b;
  font-weight: 600;
}
.theme-dark .chips-label {
  color: #94a3b8;
}
.person-chip-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  padding: 4px 10px;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
}
.theme-dark .person-chip-btn {
  background: #0f172a;
  border-color: #475569;
  color: #f1f5f9;
}
.person-chip-btn:hover {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}
.person-chip-btn:hover i {
  color: white !important;
}

/* ==================== MOBILE RESPONSIVE OPTIMIZATIONS ==================== */
@media (max-width: 576px) {
  .quiz-container {
    padding: 12px 8px 40px;
  }
  .setup-card, .play-card {
    padding: 20px 14px;
    border-radius: 18px;
  }
  .icon-circle {
    font-size: 28px;
  }
  .title-text {
    font-size: 20px;
  }
  .status-banner {
    padding: 12px 14px;
    flex-direction: column;
    text-align: center;
  }
  .banner-circle {
    margin-right: 0;
    margin-bottom: 8px;
  }
  .banner-action {
    margin-top: 10px;
    width: 100%;
  }
  .banner-action .btn {
    width: 100%;
  }
  .count-pills {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .count-btn {
    width: 100%;
    padding: 8px 4px;
  }
  .scorecard-banner {
    padding: 20px 14px;
    border-radius: 18px;
  }
  .badge-emoji {
    font-size: 40px;
  }
  .stats-box {
    padding: 10px 6px;
  }
  .stat-num {
    font-size: 16px;
  }
  .stat-lbl {
    font-size: 9px;
  }
  .option-card {
    padding: 12px 12px;
  }
  .option-prefix {
    width: 28px;
    height: 28px;
    margin-right: 10px;
    font-size: 12px;
  }
  .option-label {
    font-size: 13.5px;
  }
  .review-card {
    padding: 14px 12px;
    border-radius: 14px;
  }
  .action-btn {
    font-size: 13px;
    padding: 10px 8px;
  }
}
</style>
