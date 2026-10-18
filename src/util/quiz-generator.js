/**
 * Scalable Question Template Engine for Bloodline Family Quiz in Vue.js
 */

import { normalizeGender } from './quiz-kinship.js';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const isMale = (m) => normalizeGender(m.gender, 1) === 1;

export class QuizGenerator {
  constructor(graph, familyTitle = 'Family') {
    this.graph = graph;
    this.familyTitle = familyTitle;
  }

  generateQuiz(difficulty = 'easy', requestedCount = 10) {
    const allMembers = this.graph.members;
    if (!allMembers || allMembers.length < 4) return [];

    const templates = this._getEligibleTemplates(difficulty);
    if (templates.length === 0) return [];

    const shuffledTemplates = shuffle(templates);
    const questions = [];
    const seenKeys = new Set();
    const quotaPerTemplate = Math.ceil(requestedCount / templates.length) + 2;

    for (const t of shuffledTemplates) {
      const generated = t.fn.call(this, difficulty, quotaPerTemplate);
      for (const q of generated) {
        const key = `${q.category}_${q.text}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          questions.push(q);
        }
      }
    }

    const finalQuestions = shuffle(questions).slice(0, requestedCount);
    return finalQuestions;
  }

  _getEligibleTemplates(difficulty) {
    const templates = [];

    // 1. Photo Identification
    if (this.graph.membersWithPhotos.length >= 1 && this.graph.members.length >= 4) {
      templates.push({ name: 'photo_id', fn: this._genPhotoQuestions });
    }

    // 2. Direct Kinship
    templates.push({ name: 'direct_relation', fn: this._genDirectRelationQuestions });

    // 3. Relative Finder ("Who is the parent/child/spouse of X?")
    templates.push({ name: 'relative_finder', fn: this._genRelativeFinderQuestions });

    // 4. Age Questions (ONLY if DOB exists)
    if (this.graph.membersWithDob.length >= 1) {
      templates.push({ name: 'age_calc', fn: this._genAgeQuestions });
      templates.push({ name: 'birth_year', fn: this._genBirthYearQuestions });
    }

    // 5. Seniority (ONLY if at least 2 members have DOB)
    if (this.graph.membersWithDob.length >= 2) {
      templates.push({ name: 'seniority', fn: this._genSeniorityQuestions });
      templates.push({ name: 'tf_age', fn: this._genTrueFalseAgeQuestions });
    }

    // 6. True or False Kinship
    templates.push({ name: 'tf_relation', fn: this._genTrueFalseRelationQuestions });

    // 7. True or False Marriage
    const hasSpouses = this.graph.members.some(m => this.graph.getSpouses(m.id).length > 0);
    if (hasSpouses) {
      templates.push({ name: 'tf_marriage', fn: this._genTrueFalseMarriageQuestions });
    }

    // 8. Sibling Count
    templates.push({ name: 'sibling_count', fn: this._genSiblingCountQuestions });

    return templates;
  }

  // 1. Photo Identification Questions
  _genPhotoQuestions(difficulty, count) {
    const list = [];
    const withPhotos = shuffle(this.graph.membersWithPhotos);

    for (const target of withPhotos.slice(0, count)) {
      const targetIsMale = isMale(target);
      const sameGender = shuffle(this.graph.members.filter(m => m.id !== target.id && isMale(m) === targetIsMale));
      const otherGender = shuffle(this.graph.members.filter(m => m.id !== target.id && isMale(m) !== targetIsMale));

      const distractors = [...sameGender.slice(0, 3)];
      if (distractors.length < 3) {
        distractors.push(...otherGender.slice(0, 3 - distractors.length));
      }
      if (distractors.length < 3) continue;

      const options = shuffle([target, ...distractors]);
      const correctIdx = options.findIndex(m => m.id === target.id);
      const targetName = this.graph.getName(target);

      list.push({
        id: `photo_${target.id}_${Math.random()}`,
        category: 'Photo ID',
        text: 'Who is the family member shown in this photograph?',
        type: 'multipleChoice',
        photo: target.photo,
        options: options.map(m => this.graph.getName(m)),
        correctIndex: correctIdx,
        context: {
          personA: targetName,
          personAId: target.id,
          kinshipExplanation: `${targetName} is a member of the ${this.familyTitle} family tree.`,
        }
      });
    }
    return list;
  }

  // 2. Direct Relationship Questions
  _genDirectRelationQuestions(difficulty, count) {
    const list = [];
    const members = shuffle(this.graph.members);

    for (const a of members) {
      if (list.length >= count) break;
      const others = shuffle(this.graph.members.filter(m => m.id !== a.id));

      for (const b of others) {
        const rel = this.graph.getRelationship(a.id, b.id);
        if (!rel || rel === 'Self' || rel === 'Relative') continue;

        const isEasy = ['Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Husband', 'Wife'].includes(rel);
        const isMed = ['Grandfather', 'Grandmother', 'Grandson', 'Granddaughter', 'Uncle', 'Aunt', 'Nephew', 'Niece'].includes(rel);
        const isHard = ['Cousin', 'Father-in-law', 'Mother-in-law', 'Brother-in-law', 'Sister-in-law', 'Great-Grandfather', 'Great-Grandmother'].includes(rel);

        if (difficulty === 'easy' && !isEasy) continue;
        if (difficulty === 'medium' && !(isEasy || isMed)) continue;
        if (difficulty === 'hard' && !(isMed || isHard)) continue;

        const aIsMale = isMale(a);
        const pool = aIsMale
          ? ['Father', 'Brother', 'Son', 'Uncle', 'Grandfather', 'Nephew', 'Cousin', 'Husband', 'Brother-in-law']
          : ['Mother', 'Sister', 'Daughter', 'Aunt', 'Grandmother', 'Niece', 'Cousin', 'Wife', 'Sister-in-law'];
        const distractors = shuffle(pool.filter(r => r !== rel)).slice(0, 3);
        const options = shuffle([rel, ...distractors]);
        const correctIdx = options.indexOf(rel);

        const aName = this.graph.getName(a);
        const bName = this.graph.getName(b);

        list.push({
          id: `rel_${a.id}_${b.id}_${Math.random()}`,
          category: 'Kinship',
          text: `What is the relationship of ${aName} to ${bName}?`,
          type: 'multipleChoice',
          options,
          correctIndex: correctIdx,
          context: {
            personA: aName,
            personAId: a.id,
            personB: bName,
            personBId: b.id,
            correctRelation: rel,
            kinshipExplanation: this.graph.getKinshipExplanation(a.id, b.id, this.familyTitle),
          }
        });
        break;
      }
    }
    return list;
  }

  // 3. Relative Finder Questions ("Who is the Father/Mother/Spouse of X?")
  _genRelativeFinderQuestions(difficulty, count) {
    const list = [];
    const members = shuffle(this.graph.members);

    for (const b of members) {
      if (list.length >= count) break;
      const targets = [];

      this.graph.getParents(b.id).forEach(pId => {
        const p = this.graph.getMember(pId);
        if (p) targets.push({ member: p, rel: isMale(p) ? 'Father' : 'Mother' });
      });
      this.graph.getSpouses(b.id).forEach(sId => {
        const s = this.graph.getMember(sId);
        if (s) targets.push({ member: s, rel: isMale(s) ? 'Husband' : 'Wife' });
      });
      this.graph.getChildren(b.id).forEach(cId => {
        const c = this.graph.getMember(cId);
        if (c) targets.push({ member: c, rel: isMale(c) ? 'Son' : 'Daughter' });
      });
      this.graph.getSiblings(b.id).forEach(sibId => {
        const sib = this.graph.getMember(sibId);
        if (sib) targets.push({ member: sib, rel: isMale(sib) ? 'Brother' : 'Sister' });
      });

      if (targets.length === 0) continue;
      const chosen = shuffle(targets)[0];
      const target = chosen.member;
      const rel = chosen.rel;

      const distractors = shuffle(
        this.graph.members.filter(m => m.id !== target.id && m.id !== b.id)
      ).slice(0, 3);
      if (distractors.length < 3) continue;

      const options = shuffle([target, ...distractors]);
      const correctIdx = options.findIndex(m => m.id === target.id);
      const bName = this.graph.getName(b);
      const targetName = this.graph.getName(target);

      list.push({
        id: `finder_${b.id}_${target.id}_${Math.random()}`,
        category: 'Who is Who',
        text: `Who is the ${rel} of ${bName}?`,
        type: 'multipleChoice',
        options: options.map(m => this.graph.getName(m)),
        correctIndex: correctIdx,
        context: {
          personA: targetName,
          personAId: target.id,
          personB: bName,
          personBId: b.id,
          correctRelation: rel,
          kinshipExplanation: `${targetName} is the ${rel} of ${bName}.`,
        }
      });
    }
    return list;
  }

  // 4. Age Questions (Only if DOB exists)
  _genAgeQuestions(difficulty, count) {
    const list = [];
    const withDob = shuffle(this.graph.membersWithDob);

    for (const m of withDob.slice(0, count)) {
      if (m.age === null) continue;
      const actualAge = m.age;
      const offsets = shuffle([-6, -4, -2, 3, 5, 8]);
      const distractorAges = new Set();
      for (const off of offsets) {
        const cand = actualAge + off;
        if (cand > 0 && cand !== actualAge) distractorAges.add(cand);
        if (distractorAges.size === 3) break;
      }
      if (distractorAges.size < 3) continue;

      const options = shuffle([`${actualAge} years old`, ...Array.from(distractorAges).map(a => `${a} years old`)]);
      const correctIdx = options.indexOf(`${actualAge} years old`);
      const mName = this.graph.getName(m);

      list.push({
        id: `age_${m.id}_${Math.random()}`,
        category: 'Age Trivia',
        text: m.is_died ? `At what age did ${mName} pass away?` : `How old is ${mName} today?`,
        type: 'multipleChoice',
        options,
        correctIndex: correctIdx,
        context: {
          personA: mName,
          personAId: m.id,
          actualAge,
          kinshipExplanation: `${mName} was born in ${m.dob_y}, making their age ${actualAge} years old.`,
        }
      });
    }
    return list;
  }

  // 5. Birth Year Questions (Only if DOB exists)
  _genBirthYearQuestions(difficulty, count) {
    const list = [];
    const withDob = shuffle(this.graph.membersWithDob);

    for (const m of withDob.slice(0, count)) {
      if (!m.dob_y) continue;
      const year = m.dob_y;
      const deltas = shuffle([-5, -3, -1, 2, 4, 7]);
      const distractorYears = new Set();
      for (const d of deltas) {
        const cand = year + d;
        if (cand !== year) distractorYears.add(cand);
        if (distractorYears.size === 3) break;
      }
      if (distractorYears.size < 3) continue;

      const options = shuffle([`${year}`, ...Array.from(distractorYears).map(y => `${y}`)]);
      const correctIdx = options.indexOf(`${year}`);
      const mName = this.graph.getName(m);

      list.push({
        id: `birth_${m.id}_${Math.random()}`,
        category: 'Birth Year',
        text: `In which year was ${mName} born?`,
        type: 'multipleChoice',
        options,
        correctIndex: correctIdx,
        context: {
          personA: mName,
          personAId: m.id,
          birthYear: year,
          kinshipExplanation: `${mName} was born in the year ${year}.`,
        }
      });
    }
    return list;
  }

  // 6. Seniority Comparison (Only if 2+ members have DOB)
  _genSeniorityQuestions(difficulty, count) {
    const list = [];
    const withDob = shuffle(this.graph.membersWithDob);

    for (let i = 0; i < withDob.length - 1; i++) {
      if (list.length >= count) break;
      const a = withDob[i];
      const b = withDob[i + 1];
      if (a.dob_y === b.dob_y) continue;

      const older = a.dob_y < b.dob_y ? a : b;
      const younger = a.dob_y < b.dob_y ? b : a;

      const aName = this.graph.getName(a);
      const bName = this.graph.getName(b);
      const olderName = this.graph.getName(older);
      const youngerName = this.graph.getName(younger);

      const options = [aName, bName];
      const correctIdx = options.indexOf(olderName);

      list.push({
        id: `senior_${a.id}_${b.id}_${Math.random()}`,
        category: 'Seniority',
        text: `Who is elder between ${aName} and ${bName}?`,
        type: 'multipleChoice',
        options,
        correctIndex: correctIdx,
        context: {
          personA: olderName,
          personAId: older.id,
          personB: youngerName,
          personBId: younger.id,
          kinshipExplanation: `${olderName} (born ${older.dob_y}) is older than ${youngerName} (born ${younger.dob_y}).`,
        }
      });
    }
    return list;
  }

  // 7. True or False Kinship
  _genTrueFalseRelationQuestions(difficulty, count) {
    const list = [];
    const members = shuffle(this.graph.members);

    for (const a of members) {
      if (list.length >= count) break;
      const others = shuffle(this.graph.members.filter(m => m.id !== a.id));

      for (const b of others) {
        const trueRel = this.graph.getRelationship(a.id, b.id);
        if (!trueRel || trueRel === 'Self' || trueRel === 'Relative') continue;

        const aIsMale = isMale(a);
        const isTrue = Math.random() >= 0.5;
        let statementRel = trueRel;
        if (!isTrue) {
          const fakePool = aIsMale
            ? ['Uncle', 'Cousin', 'Father', 'Brother', 'Grandfather', 'Son', 'Nephew']
            : ['Aunt', 'Cousin', 'Mother', 'Sister', 'Grandmother', 'Daughter', 'Niece'];
          const eligiblePool = fakePool.filter(r => r !== trueRel);
          statementRel = shuffle(eligiblePool)[0];
        }

        const aName = this.graph.getName(a);
        const bName = this.graph.getName(b);

        const explanation = isTrue
          ? `${aName} is indeed the ${trueRel} of ${bName}.`
          : `${aName} is actually the ${trueRel} of ${bName}, NOT their ${statementRel}!`;

        list.push({
          id: `tf_rel_${a.id}_${b.id}_${Math.random()}`,
          category: 'True / False',
          text: `True or False: ${aName} is the ${statementRel} of ${bName}.`,
          type: 'trueFalse',
          options: ['True', 'False'],
          correctIndex: isTrue ? 0 : 1,
          context: {
            personA: aName,
            personAId: a.id,
            personB: bName,
            personBId: b.id,
            claimedRelation: statementRel,
            actualRelation: trueRel,
            isStatementTrue: isTrue,
            kinshipExplanation: explanation,
          }
        });
        break;
      }
    }
    return list;
  }

  // 8. True or False Marriage
  _genTrueFalseMarriageQuestions(difficulty, count) {
    const list = [];
    const married = shuffle(this.graph.members.filter(m => this.graph.getSpouses(m.id).length > 0));

    for (const a of married.slice(0, count)) {
      const spouseId = this.graph.getSpouses(a.id)[0];
      const actualSpouse = this.graph.getMember(spouseId);
      if (!actualSpouse) continue;

      const aIsMale = isMale(a);
      const isTrue = Math.random() >= 0.5;
      let testPartner = actualSpouse;

      if (!isTrue) {
        // Pick someone of opposite gender who is NOT a spouse of a
        const notSpouse = shuffle(
          this.graph.members.filter(m => m.id !== a.id && !this.graph.getSpouses(a.id).includes(m.id) && isMale(m) !== aIsMale)
        );
        if (notSpouse.length === 0) continue;
        testPartner = notSpouse[0];
      }

      const aName = this.graph.getName(a);
      const partnerName = this.graph.getName(testPartner);
      const actualName = this.graph.getName(actualSpouse);

      const explanation = isTrue
        ? `${aName} and ${partnerName} are married.`
        : `${aName} is NOT married to ${partnerName}. Their spouse is ${actualName}.`;

      list.push({
        id: `tf_marr_${a.id}_${testPartner.id}_${Math.random()}`,
        category: 'True / False',
        text: `True or False: ${aName} is married to ${partnerName}.`,
        type: 'trueFalse',
        options: ['True', 'False'],
        correctIndex: isTrue ? 0 : 1,
        context: {
          personA: aName,
          personAId: a.id,
          personB: partnerName,
          personBId: testPartner.id,
          actualSpouse: actualName,
          actualSpouseId: actualSpouse.id,
          isStatementTrue: isTrue,
          kinshipExplanation: explanation,
        }
      });
    }
    return list;
  }

  // 9. True or False Age Comparison
  _genTrueFalseAgeQuestions(difficulty, count) {
    const list = [];
    const withDob = shuffle(this.graph.membersWithDob);

    for (let i = 0; i < withDob.length - 1; i++) {
      if (list.length >= count) break;
      const a = withDob[i];
      const b = withDob[i + 1];
      if (a.dob_y === b.dob_y) continue;

      const isAOlder = a.dob_y < b.dob_y;
      const aName = this.graph.getName(a);
      const bName = this.graph.getName(b);

      list.push({
        id: `tf_age_${a.id}_${b.id}_${Math.random()}`,
        category: 'True / False',
        text: `True or False: ${aName} is older than ${bName}.`,
        type: 'trueFalse',
        options: ['True', 'False'],
        correctIndex: isAOlder ? 0 : 1,
        context: {
          personA: aName,
          personAId: a.id,
          personB: bName,
          personBId: b.id,
          kinshipExplanation: `${aName} was born in ${a.dob_y} and ${bName} was born in ${b.dob_y}.`,
        }
      });
    }
    return list;
  }

  // 10. Sibling Count
  _genSiblingCountQuestions(difficulty, count) {
    const list = [];
    const members = shuffle(this.graph.members);

    for (const m of members.slice(0, count)) {
      const sibs = this.graph.getSiblings(m.id);
      const countNum = sibs.length;

      let correctLabel = '';
      if (countNum === 0) correctLabel = 'None (Only child)';
      else if (countNum === 1) correctLabel = '1 sibling';
      else if (countNum === 2) correctLabel = '2 siblings';
      else correctLabel = `${countNum} siblings`;

      const pool = shuffle(['None (Only child)', '1 sibling', '2 siblings', '3 siblings', '4 siblings'].filter(x => x !== correctLabel));
      const options = shuffle([correctLabel, ...pool.slice(0, 3)]);
      const correctIdx = options.indexOf(correctLabel);
      const mName = this.graph.getName(m);

      list.push({
        id: `sibs_${m.id}_${Math.random()}`,
        category: 'Family Size',
        text: `How many siblings does ${mName} have in the family tree?`,
        type: 'multipleChoice',
        options,
        correctIndex: correctIdx,
        context: {
          personA: mName,
          personAId: m.id,
          siblingCount: countNum,
          kinshipExplanation: `${mName} has ${correctLabel}.`,
        }
      });
    }
    return list;
  }
}
