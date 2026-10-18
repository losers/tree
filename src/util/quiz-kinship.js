/**
 * Kinship graph and relationship calculator for Bloodline Family Tree in Vue.js
 */

export function normalizeGender(val, defaultVal = 1) {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (val === 1 || val === '1' || val === true) return 1;
  if (val === 0 || val === '0' || val === false) return 0;
  const s = String(val).toLowerCase().trim();
  if (s === 'male' || s === 'm') return 1;
  if (s === 'female' || s === 'f') return 0;
  return defaultVal;
}

export class KinshipGraph {
  constructor(treeRoot, memberDetails = [], images = {}) {
    this.members = [];
    this.memberMap = {};
    this.parentsMap = {};
    this.childrenMap = {};
    this.spousesMap = {};
    this.siblingsMap = {};
    this.generationMap = {};
    this.images = images || {};

    this._detailsMap = {};
    if (Array.isArray(memberDetails)) {
      memberDetails.forEach(m => {
        const id = m._id || m.id;
        if (id) this._detailsMap[id] = m;
      });
    }

    if (treeRoot && (treeRoot.id || treeRoot.name)) {
      this._buildFromTree(treeRoot);
    }
  }

  _buildFromTree(treeRoot) {
    const visited = new Set();

    const traverse = (node, parentId) => {
      const id = node.id || node._id;
      if (!id || visited.has(id)) return;
      visited.add(id);

      const details = this._detailsMap[id] || {};
      const photo = this.images[id] || null;

      const rawGender = details.gender !== undefined ? details.gender : (node.gender !== undefined ? node.gender : 1);
      const memberGender = normalizeGender(rawGender, 1); // 1 = Male, 0 = Female

      const member = {
        id,
        name: details.name || node.name || 'Member',
        short_name: details.short_name || node.name || 'Member',
        gender: memberGender,
        dob_y: details.dob_y || null,
        dob_m: details.dob_m || null,
        dob_d: details.dob_d || null,
        dod_y: details.dod_y || null,
        dod_m: details.dod_m || null,
        dod_d: details.dod_d || null,
        is_died: details.is_died || false,
        photo,
        description: details.description || '',
      };

      // Calculate age if dob_y exists
      if (member.dob_y) {
        const now = new Date();
        const endYear = (member.is_died && member.dod_y) ? member.dod_y : now.getFullYear();
        member.age = endYear - member.dob_y;
      } else {
        member.age = null;
      }

      this.members.push(member);
      this.memberMap[id] = member;

      // Handle Spouses (mate)
      if (Array.isArray(node.mate)) {
        node.mate.forEach(m => {
          const mId = m.id || m._id;
          if (mId) {
            this._addSpouseLink(id, mId);

            if (!visited.has(mId)) {
              visited.add(mId);
              const mDetails = this._detailsMap[mId] || {};
              const mPhoto = this.images[mId] || null;

              const mateRawGender = mDetails.gender !== undefined ? mDetails.gender : (m.gender !== undefined ? m.gender : undefined);
              const defaultMateGender = memberGender === 1 ? 0 : 1;
              const mateGender = normalizeGender(mateRawGender, defaultMateGender);

              const mateMember = {
                id: mId,
                name: mDetails.name || m.name || 'Spouse',
                short_name: mDetails.short_name || m.name || 'Spouse',
                gender: mateGender,
                dob_y: mDetails.dob_y || null,
                dob_m: mDetails.dob_m || null,
                dob_d: mDetails.dob_d || null,
                dod_y: mDetails.dod_y || null,
                is_died: mDetails.is_died || false,
                photo: mPhoto,
                description: mDetails.description || '',
              };
              if (mateMember.dob_y) {
                const now = new Date();
                const endYear = (mateMember.is_died && mateMember.dod_y) ? mateMember.dod_y : now.getFullYear();
                mateMember.age = endYear - mateMember.dob_y;
              } else {
                mateMember.age = null;
              }
              this.members.push(mateMember);
              this.memberMap[mId] = mateMember;
            }
          }
        });
      }

      // Handle Parent/Child links
      if (parentId) {
        this._addChildLink(parentId, id);
        // Also link to spouses of parent as co-parents
        const parentSpouses = this.spousesMap[parentId] || [];
        parentSpouses.forEach(spId => this._addChildLink(spId, id));
      }

      // Traverse children
      if (Array.isArray(node.children)) {
        node.children.forEach(c => traverse(c, id));
      }
    };

    traverse(treeRoot, null);
    this._computeSiblings();
    this._computeGenerations(treeRoot);
    this._computeNameDisambiguation();
  }

  _computeNameDisambiguation() {
    const counts = {};
    this.members.forEach(m => {
      const s = (m.short_name || m.name || '').trim().toLowerCase();
      if (s) counts[s] = (counts[s] || 0) + 1;
    });

    this._duplicateNameSet = new Set(
      Object.entries(counts).filter(([_, c]) => c > 1).map(([n]) => n)
    );

    this.members.forEach(m => {
      m.displayName = this._buildMemberDisplayName(m);
    });
  }

  _buildMemberDisplayName(m) {
    const sName = (m.short_name || m.name || '').trim();
    const fName = (m.name || '').trim();
    const sLower = sName.toLowerCase();

    // If not a duplicate name, just use short_name or name
    if (!this._duplicateNameSet || !this._duplicateNameSet.has(sLower)) {
      return sName || fName || 'Member';
    }

    // Has duplicate name: "provide Full Name in brackets for easy identification"
    if (fName && fName.toLowerCase() !== sLower) {
      return `${sName} (${fName})`;
    }

    // If full name is identical to short_name, disambiguate with spouse or parent
    const spouses = this.getSpouses(m.id);
    if (spouses.length > 0) {
      const sp = this.getMember(spouses[0]);
      if (sp) {
        const spName = (sp.short_name || sp.name || '').trim();
        const isFemale = normalizeGender(m.gender, 0) === 0;
        return `${sName} (${isFemale ? 'w/o' : 'h/o'} ${spName})`;
      }
    }

    const parents = this.getParents(m.id);
    if (parents.length > 0) {
      const p = this.getMember(parents[0]);
      if (p) {
        const pName = (p.short_name || p.name || '').trim();
        const isFemale = normalizeGender(m.gender, 0) === 0;
        return `${sName} (${isFemale ? 'd/o' : 's/o'} ${pName})`;
      }
    }

    return fName || sName || 'Member';
  }

  getName(mId) {
    if (!mId) return '';
    const m = typeof mId === 'object' ? mId : this.getMember(mId);
    if (!m) return '';
    return m.displayName || m.short_name || m.name || 'Member';
  }

  _addSpouseLink(id1, id2) {
    if (!this.spousesMap[id1]) this.spousesMap[id1] = [];
    if (!this.spousesMap[id2]) this.spousesMap[id2] = [];
    if (!this.spousesMap[id1].includes(id2)) this.spousesMap[id1].push(id2);
    if (!this.spousesMap[id2].includes(id1)) this.spousesMap[id2].push(id1);
  }

  _addChildLink(parentId, childId) {
    if (!this.childrenMap[parentId]) this.childrenMap[parentId] = [];
    if (!this.parentsMap[childId]) this.parentsMap[childId] = [];
    if (!this.childrenMap[parentId].includes(childId)) this.childrenMap[parentId].push(childId);
    if (!this.parentsMap[childId].includes(parentId)) this.parentsMap[childId].push(parentId);
  }

  _computeSiblings() {
    this.members.forEach(m => {
      const parents = this.parentsMap[m.id] || [];
      const sibSet = new Set();
      parents.forEach(pId => {
        const children = this.childrenMap[pId] || [];
        children.forEach(cId => {
          if (cId !== m.id) sibSet.add(cId);
        });
      });
      this.siblingsMap[m.id] = Array.from(sibSet);
    });
  }

  _computeGenerations(rootNode) {
    const rootId = rootNode.id || rootNode._id;
    const queue = [rootId];
    this.generationMap[rootId] = 0;

    while (queue.length > 0) {
      const curId = queue.shift();
      const curGen = this.generationMap[curId] || 0;

      // Spouses share generation
      const spouses = this.spousesMap[curId] || [];
      spouses.forEach(sId => {
        if (this.generationMap[sId] === undefined) {
          this.generationMap[sId] = curGen;
          queue.push(sId);
        }
      });

      // Children are +1 generation
      const children = this.childrenMap[curId] || [];
      children.forEach(cId => {
        if (this.generationMap[cId] === undefined) {
          this.generationMap[cId] = curGen + 1;
          queue.push(cId);
        }
      });
    }

    this.members.forEach(m => {
      if (this.generationMap[m.id] === undefined) this.generationMap[m.id] = 0;
    });
  }

  getMember(id) {
    return this.memberMap[id];
  }

  getParents(id) {
    return this.parentsMap[id] || [];
  }

  getChildren(id) {
    return this.childrenMap[id] || [];
  }

  getSpouses(id) {
    return this.spousesMap[id] || [];
  }

  getSiblings(id) {
    return this.siblingsMap[id] || [];
  }

  getGeneration(id) {
    return this.generationMap[id] || 0;
  }

  get membersWithPhotos() {
    return this.members.filter(m => m.photo && m.photo.trim().length > 0);
  }

  get membersWithDob() {
    return this.members.filter(m => m.dob_y && m.dob_y > 0);
  }

  /**
   * Identifies what Person A is to Person B
   */
  getRelationship(aId, bId) {
    if (aId === bId) return 'Self';
    const a = this.getMember(aId);
    const b = this.getMember(bId);
    if (!a || !b) return null;

    const isMale = normalizeGender(a.gender, 1) === 1;

    // 1. Spouses
    const bSpouses = this.getSpouses(bId);
    if (bSpouses.includes(aId)) {
      return isMale ? 'Husband' : 'Wife';
    }

    // 2. Parents
    const bParents = this.getParents(bId);
    if (bParents.includes(aId)) {
      return isMale ? 'Father' : 'Mother';
    }

    // 3. Children
    const bChildren = this.getChildren(bId);
    if (bChildren.includes(aId)) {
      return isMale ? 'Son' : 'Daughter';
    }

    // 4. Siblings
    const bSiblings = this.getSiblings(bId);
    if (bSiblings.includes(aId)) {
      return isMale ? 'Brother' : 'Sister';
    }

    // 5. Grandparents (A is parent of a parent of B)
    for (const p of bParents) {
      if (this.getParents(p).includes(aId)) {
        return isMale ? 'Grandfather' : 'Grandmother';
      }
    }

    // 6. Grandchildren (A is child of a child of B)
    for (const c of bChildren) {
      if (this.getChildren(c).includes(aId)) {
        return isMale ? 'Grandson' : 'Granddaughter';
      }
    }

    // 7. Uncle / Aunt (A is sibling of B's parent or married to parent's sibling)
    for (const p of bParents) {
      const pSibs = this.getSiblings(p);
      if (pSibs.includes(aId)) {
        return isMale ? 'Uncle' : 'Aunt';
      }
      for (const pSib of pSibs) {
        if (this.getSpouses(pSib).includes(aId)) {
          return isMale ? 'Uncle' : 'Aunt';
        }
      }
    }

    // 8. Nephew / Niece (A is child of B's sibling)
    for (const s of bSiblings) {
      if (this.getChildren(s).includes(aId)) {
        return isMale ? 'Nephew' : 'Niece';
      }
    }

    // 9. Cousins (Parents of A and B are siblings)
    const aParents = this.getParents(aId);
    for (const aP of aParents) {
      for (const bP of bParents) {
        if (this.getSiblings(bP).includes(aP)) {
          return 'Cousin';
        }
      }
    }

    // 10. In-laws
    // Father/Mother in law (A is parent of B's spouse)
    for (const sp of bSpouses) {
      if (this.getParents(sp).includes(aId)) {
        return isMale ? 'Father-in-law' : 'Mother-in-law';
      }
    }

    // Son/Daughter in law (A is spouse of B's child)
    for (const ch of bChildren) {
      if (this.getSpouses(ch).includes(aId)) {
        return isMale ? 'Son-in-law' : 'Daughter-in-law';
      }
    }

    // Brother/Sister in law
    for (const sp of bSpouses) {
      if (this.getSiblings(sp).includes(aId)) {
        return isMale ? 'Brother-in-law' : 'Sister-in-law';
      }
    }
    for (const sib of bSiblings) {
      if (this.getSpouses(sib).includes(aId)) {
        return isMale ? 'Brother-in-law' : 'Sister-in-law';
      }
    }

    // 11. Great Grandparents
    for (const p of bParents) {
      for (const gp of this.getParents(p)) {
        if (this.getParents(gp).includes(aId)) {
          return isMale ? 'Great-Grandfather' : 'Great-Grandmother';
        }
      }
    }

    // 12. Great Grandchildren
    for (const c of bChildren) {
      for (const gc of this.getChildren(c)) {
        if (this.getChildren(gc).includes(aId)) {
          return isMale ? 'Great-Grandson' : 'Great-Granddaughter';
        }
      }
    }

    return 'Relative';
  }

  /**
   * Generates a 1-2 sentence lineage explanation (used for context to Gemini AI and local fallback)
   */
  getKinshipExplanation(aId, bId, familyTitle = 'the family') {
    const a = this.getMember(aId);
    const b = this.getMember(bId);
    if (!a || !b) return '';

    const rel = this.getRelationship(aId, bId);
    const aName = this.getName(a);
    const bName = this.getName(b);

    if (this.getSpouses(bId).includes(aId)) {
      return `${aName} is married to ${bName} as their ${rel}.`;
    }
    if (this.getParents(bId).includes(aId)) {
      return `${aName} is the biological ${rel} of ${bName}.`;
    }
    if (this.getChildren(bId).includes(aId)) {
      return `${aName} is the ${rel} of ${bName}.`;
    }
    if (this.getSiblings(bId).includes(aId)) {
      return `${aName} and ${bName} are ${rel}s sharing the same parents.`;
    }

    // Grandparents
    const bParents = this.getParents(bId);
    for (const pId of bParents) {
      if (this.getParents(pId).includes(aId)) {
        const p = this.getMember(pId);
        const pName = p ? this.getName(p) : 'their parent';
        const pLabel = p && normalizeGender(p.gender, 1) === 0 ? 'mother' : 'father';
        return `${aName} is ${bName}'s ${rel} because ${aName} is the parent of ${bName}'s ${pLabel} ${pName}.`;
      }
    }

    // Uncle / Aunt
    for (const pId of bParents) {
      const p = this.getMember(pId);
      const pSibs = this.getSiblings(pId);
      if (pSibs.includes(aId)) {
        const pName = p ? this.getName(p) : 'their parent';
        const pLabel = p && normalizeGender(p.gender, 1) === 0 ? 'mother' : 'father';
        return `${aName} is ${bName}'s ${rel} because ${aName} is the sibling of ${bName}'s ${pLabel} ${pName}.`;
      }
    }

    // Cousin
    for (const aP of this.getParents(aId)) {
      for (const bP of bParents) {
        if (this.getSiblings(bP).includes(aP)) {
          const aPM = this.getMember(aP);
          const bPM = this.getMember(bP);
          return `${aName} is ${bName}'s Cousin because their parents (${aPM ? this.getName(aPM) : 'Parent'} and ${bPM ? this.getName(bPM) : 'Parent'}) are siblings.`;
        }
      }
    }

    return `${aName} is the ${rel} of ${bName} in ${familyTitle}.`;
  }
}
