import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';

const physics11 = [
  { id: 'ch1', title: 'Chapter 1: Units and Measurements', pdf: '11_PhysicsChapter_1.pdf' },
  { id: 'ch2', title: 'Chapter 2: Mathematical Methods', pdf: '11_PhysicsChapter_2.pdf' },
  { id: 'ch3', title: 'Chapter 3: Motion in a Plane', pdf: '11_PhysicsChapter_3.pdf' },
  { id: 'ch4', title: 'Chapter 4: Laws of Motion', pdf: '11_PhysicsChapter_4.pdf' },
  { id: 'ch5', title: 'Chapter 5: Gravitation', pdf: '11_PhysicsChapter_5.pdf' },
  { id: 'ch6', title: 'Chapter 6: Mechanical Properties of Solids', pdf: '11_PhysicsChapter_6.pdf' },
  { id: 'ch7', title: 'Chapter 7: Thermal Properties of Matter', pdf: '11_PhysicsChapter_7.pdf' },
  { id: 'ch8', title: 'Chapter 8: Sound', pdf: '11_PhysicsChapter_8.pdf' },
  { id: 'ch9', title: 'Chapter 9: Optics', pdf: '11_PhysicsChapter_9.pdf' },
  { id: 'ch10', title: 'Chapter 10: Electrostatics', pdf: '11_PhysicsChapter_10.pdf' },
  { id: 'ch11', title: 'Chapter 11: Electric Current Through Conductors', pdf: '11_PhysicsChapter_11.pdf' },
  { id: 'ch12', title: 'Chapter 12: Magnetism', pdf: '11_PhysicsChapter_12.pdf' },
  { id: 'ch13', title: 'Chapter 13: Electromagnetic Waves and Communication System', pdf: '11_PhysicsChapter_13.pdf' },
  { id: 'ch14', title: 'Chapter 14: Semiconductors', pdf: '11_PhysicsChapter_14.pdf' },
];

const physics12 = [
  { id: 'ch1', title: 'Chapter 1: Rotational Dynamics', pdf: '12_PhysicsChapter_1.pdf' },
  { id: 'ch2', title: 'Chapter 2: Mechanical Properties of Fluids', pdf: '12_PhysicsChapter_2.pdf' },
  { id: 'ch3', title: 'Chapter 3: Kinetic Theory of Gases and Radiation', pdf: '12_PhysicsChapter_3.pdf' },
  { id: 'ch4', title: 'Chapter 4: Thermodynamics', pdf: '12_PhysicsChapter_4.pdf' },
  { id: 'ch5', title: 'Chapter 5: Oscillations', pdf: '12_PhysicsChapter_5.pdf' },
  { id: 'ch6', title: 'Chapter 6: Superposition of Waves', pdf: '12_PhysicsChapter_6.pdf' },
  { id: 'ch7', title: 'Chapter 7: Wave Optics', pdf: '12_PhysicsChapter_7.pdf' },
  { id: 'ch8', title: 'Chapter 8: Electrostatics', pdf: '12_PhysicsChapter_8.pdf' },
  { id: 'ch9', title: 'Chapter 9: Current Electricity', pdf: '12_PhysicsChapter_9.pdf' },
  { id: 'ch10', title: 'Chapter 10: Magnetic Fields due to Electric Current', pdf: '12_PhysicsChapter_10.pdf' },
  { id: 'ch11', title: 'Chapter 11: Magnetic Materials', pdf: '12_PhysicsChapter_11.pdf' },
  { id: 'ch12', title: 'Chapter 12: Electromagnetic induction', pdf: '12_PhysicsChapter_12.pdf' },
  { id: 'ch13', title: 'Chapter 13: AC Circuits', pdf: '12_PhysicsChapter_13.pdf' },
  { id: 'ch14', title: 'Chapter 14: Dual Nature of Radiation and Matter', pdf: '12_PhysicsChapter_14.pdf' },
  { id: 'ch15', title: 'Chapter 15: Structure of Atoms and Nuclei', pdf: '12_PhysicsChapter_15.pdf' },
  { id: 'ch16', title: 'Chapter 16: Semiconductor Devices', pdf: '12_PhysicsChapter_16.pdf' },
];

const chemistry11 = [
  { id: 'ch1', title: 'Chapter 1: Some Basic Concepts of Chemistry', pdf: '11_ChemistryChapter_1.pdf' },
  { id: 'ch2', title: 'Chapter 2: Introduction to Analytical Chemistry', pdf: '11_ChemistryChapter_2.pdf' },
  { id: 'ch3', title: 'Chapter 3: Some Analytical Techniques', pdf: '11_ChemistryChapter_3.pdf' },
  { id: 'ch4', title: 'Chapter 4: Structure of Atom', pdf: '11_ChemistryChapter_4.pdf' },
  { id: 'ch5', title: 'Chapter 5: Chemical Bonding', pdf: '11_ChemistryChapter_5.pdf' },
  { id: 'ch6', title: 'Chapter 6: Redox Reactions', pdf: '11_ChemistryChapter_6.pdf' },
  { id: 'ch7', title: 'Chapter 7: Modern Periodic Table', pdf: '11_ChemistryChapter_7.pdf' },
  { id: 'ch8', title: 'Chapter 8: Elements of Group 1 and 2', pdf: '11_ChemistryChapter_8.pdf' },
  { id: 'ch9', title: 'Chapter 9: Elements of Group 13, 14 and 15', pdf: '11_ChemistryChapter_9.pdf' },
  { id: 'ch10', title: 'Chapter 10: States of Matter', pdf: '11_ChemistryChapter_10.pdf' },
  { id: 'ch11', title: 'Chapter 11: Adsorption and Colloids', pdf: '11_ChemistryChapter_11.pdf' },
  { id: 'ch12', title: 'Chapter 12: Chemical Equilibrium', pdf: '11_ChemistryChapter_12.pdf' },
  { id: 'ch13', title: 'Chapter 13: Nuclear Chemistry and Radioactivity', pdf: '11_ChemistryChapter_13.pdf' },
  { id: 'ch14', title: 'Chapter 14: Basic Principles of Organic Chemistry', pdf: '11_ChemistryChapter_14.pdf' },
  { id: 'ch15', title: 'Chapter 15: Hydrocarbons', pdf: '11_ChemistryChapter_15.pdf' },
  { id: 'ch16', title: 'Chapter 16: Chemistry in Everyday Life', pdf: '11_ChemistryChapter_16.pdf' },
  { id: 'ch17', title: 'Modern  Periodic Table', pdf: '11_ChemistryChapter_PeriodicTable.pdf' },
];

const chemistry12 = [
  { id: 'ch1', title: 'Chapter 1: Solid State', pdf: '12_ChemistryChapter_1.pdf' },
  { id: 'ch2', title: 'Chapter 2: Solutions', pdf: '12_ChemistryChapter_2.pdf' },
  { id: 'ch3', title: 'Chapter 3: Ionic Equilibria', pdf: '12_ChemistryChapter_3.pdf' },
  { id: 'ch4', title: 'Chapter 4: Chemical Thermodynamics', pdf: '12_ChemistryChapter_4.pdf' },
  { id: 'ch5', title: 'Chapter 5: Electrochemistry', pdf: '12_ChemistryChapter_5.pdf' },
  { id: 'ch6', title: 'Chapter 6: Chemical Kinetics', pdf: '12_ChemistryChapter_6.pdf' },
  { id: 'ch7', title: 'Chapter 7: Elements of Groups 16, 17 and 18', pdf: '12_ChemistryChapter_7.pdf' },
  { id: 'ch8', title: 'Chapter 8: Transition and Inner transition Elements', pdf: '12_ChemistryChapter_8.pdf' },
  { id: 'ch9', title: 'Chapter 9: Coordination Compounds', pdf: '12_ChemistryChapter_9.pdf' },
  { id: 'ch10', title: 'Chapter 10: Halogen Derivatives', pdf: '12_ChemistryChapter_10.pdf' },
  { id: 'ch11', title: 'Chapter 11: Alcohols, Phenols and Ethers', pdf: '12_ChemistryChapter_11.pdf' },
  { id: 'ch12', title: 'Chapter 12: Aldehydes, Ketones and Carboxylic acids', pdf: '12_ChemistryChapter_12.pdf' },
  { id: 'ch13', title: 'Chapter 13: Amines', pdf: '12_ChemistryChapter_13.pdf' },
  { id: 'ch14', title: 'Chapter 14: Biomolecules', pdf: '12_ChemistryChapter_14.pdf' },
  { id: 'ch15', title: 'Chapter 15: Introduction to Polymer Chemistry', pdf: '12_ChemistryChapter_15.pdf' },
  { id: 'ch16', title: 'Chapter 16: Green Chemistry and Nanochemistry', pdf: '12_ChemistryChapter_16.pdf' },
];

const biology11 = [
  { id: 'ch1', title: 'Chapter 1: Living World', pdf: '11_BiologyChapter_1.pdf' },
  { id: 'ch2', title: 'Chapter 2: Systematics of Living Organisms', pdf: '11_BiologyChapter_2.pdf' },
  { id: 'ch3', title: 'Chapter 3: Kingdom Plantae', pdf: '11_BiologyChapter_3.pdf' },
  { id: 'ch4', title: 'Chapter 4: Kingdom Animalia', pdf: '11_BiologyChapter_4.pdf' },
  { id: 'ch5', title: 'Chapter 5: Cell Structure and Organization', pdf: '11_BiologyChapter_5.pdf' },
  { id: 'ch6', title: 'Chapter 6: Biomolecules', pdf: '11_BiologyChapter_6.pdf' },
  { id: 'ch7', title: 'Chapter 7: Cell Division', pdf: '11_BiologyChapter_7.pdf' },
  { id: 'ch8', title: 'Chapter 8: Plant Tissues and Anatomy', pdf: '11_BiologyChapter_8.pdf' },
  { id: 'ch9', title: 'Chapter 9: Morphology of Flowering Plants', pdf: '11_BiologyChapter_9.pdf' },
  { id: 'ch10', title: 'Chapter 10: Animal Tissue', pdf: '11_BiologyChapter_10.pdf' },
  { id: 'ch11', title: 'Chapter 11: Study of Animal Type : Cockroach', pdf: '11_BiologyChapter_11.pdf' },
  { id: 'ch12', title: 'Chapter 12: Photosynthesis', pdf: '11_BiologyChapter_12.pdf' },
  { id: 'ch13', title: 'Chapter 13: Respiration and Energy Transfer', pdf: '11_BiologyChapter_13.pdf' },
  { id: 'ch14', title: 'Chapter 14: Human Nutrition', pdf: '11_BiologyChapter_14.pdf' },
  { id: 'ch15', title: 'Chapter 15: Excretion and Osmoregulation', pdf: '11_BiologyChapter_15.pdf' },
  { id: 'ch16', title: 'Chapter 16: Skeleton and Movement', pdf: '11_BiologyChapter_16.pdf' },
];

const biology12 = [
  { id: 'ch1', title: 'Chapter 1: Reproduction in Lower and Higher Plants', pdf: '12_BiologyChapter_1.pdf' },
  { id: 'ch2', title: 'Chapter 2: Reproduction in Lower and Higher Animals', pdf: '12_BiologyChapter_2.pdf' },
  { id: 'ch3', title: 'Chapter 3: Inheritance and Variation', pdf: '12_BiologyChapter_3.pdf' },
  { id: 'ch4', title: 'Chapter 4: Molecular Basis of Inheritance', pdf: '12_BiologyChapter_4.pdf' },
  { id: 'ch5', title: 'Chapter 5: Origin and Evolution of Life', pdf: '12_BiologyChapter_5.pdf' },
  { id: 'ch6', title: 'Chapter 6: Plant Water Relation', pdf: '12_BiologyChapter_6.pdf' },
  { id: 'ch7', title: 'Chapter 7: Plant Growth and Mineral Nutrition', pdf: '12_BiologyChapter_7.pdf' },
  { id: 'ch8', title: 'Chapter 8: Respiration and Circulation', pdf: '12_BiologyChapter_8.pdf' },
  { id: 'ch9', title: 'Chapter 9: Control and Co-ordination', pdf: '12_BiologyChapter_9.pdf' },
  { id: 'ch10', title: 'Chapter 10: Human Health and Diseases', pdf: '12_BiologyChapter_10.pdf' },
  { id: 'ch11', title: 'Chapter 11: Enhancement of Food Production', pdf: '12_BiologyChapter_11.pdf' },
  { id: 'ch12', title: 'Chapter 12: Biotechnology', pdf: '12_BiologyChapter_12.pdf' },
  { id: 'ch13', title: 'Chapter 13: Organisms and Populations', pdf: '12_BiologyChapter_13.pdf' },
  { id: 'ch14', title: 'Chapter 14: Ecosystems and Energy Flow', pdf: '12_BiologyChapter_14.pdf' },
  { id: 'ch15', title: 'Chapter 15: Biodiversity, Conservation and Environmental Issues', pdf: '12_BiologyChapter_15.pdf' },
];

const math1_11 = [
  { id: 'ch1', title: 'Chapter 1: Angle and its Measurement', pdf: '11_Math1Chapter_1.pdf' },
  { id: 'ch2', title: 'Chapter 2: Trigonometry - I', pdf: '11_Math1Chapter_2.pdf' },
  { id: 'ch3', title: 'Chapter 3: Trigonometry - II', pdf: '11_Math1Chapter_3.pdf' },
  { id: 'ch4', title: 'Chapter 4: Determinants and Matrices', pdf: '11_Math1Chapter_4.pdf' },
  { id: 'ch5', title: 'Chapter 5: Straight Line', pdf: '11_Math1Chapter_5.pdf' },
  { id: 'ch6', title: 'Chapter 6: Circle', pdf: '11_Math1Chapter_6.pdf' },
  { id: 'ch7', title: 'Chapter 7: Conic Sections', pdf: '11_Math1Chapter_7.pdf' },
  { id: 'ch8', title: 'Chapter 8: Measures of Dispersion', pdf: '11_Math1Chapter_8.pdf' },
  { id: 'ch9', title: 'Chapter 9: Probability', pdf: '11_Math1Chapter_9.pdf' },
  { id: 'ch10', title: 'Answer ', pdf: '11_MathPart1Answer.pdf' },
];

const math2_11 = [
  { id: 'ch1', title: 'Chapter 1: Partition Values', pdf: '11_Math2Chapter_1.pdf' },
  { id: 'ch2', title: 'Chapter 2: Measures of Dispersion', pdf: '11_Math2Chapter_2.pdf' },
  { id: 'ch3', title: 'Chapter 3: Skewness', pdf: '11_Math2Chapter_3.pdf' },
  { id: 'ch4', title: 'Chapter 4: Bivariate Frequency Distribution and Chi Square Statistic', pdf: '11_Math2Chapter_4.pdf' },
  { id: 'ch5', title: 'Chapter 5: Correlation', pdf: '11_Math2Chapter_5.pdf' },
  { id: 'ch6', title: 'Chapter 6: Permutations and Combinations', pdf: '11_Math2Chapter_6.pdf' },
  { id: 'ch7', title: 'Chapter 7: Probability', pdf: '11_Math2Chapter_7.pdf' },
  { id: 'ch8', title: 'Chapter 8: Linear Inequations', pdf: '11_Math2Chapter_8.pdf' },
  { id: 'ch9', title: 'Chapter 9: Commercial Mathematics', pdf: '11_Math2Chapter_9.pdf' },
  { id: 'ch10', title: 'Answer ', pdf: '11_MathPart2Answer.pdf' },
];

const math1_12 = [
  { id: 'ch1', title: 'Chapter 1: Mathematical Logic', pdf: '12_Math1Chapter_1.pdf' },
  { id: 'ch2', title: 'Chapter 2: Matrices', pdf: '12_Math1Chapter_2.pdf' },
  { id: 'ch3', title: 'Chapter 3: Trigonometric Functions', pdf: '12_Math1Chapter_3.pdf' },
  { id: 'ch4', title: 'Chapter 4: Pair of Straight Lines', pdf: '12_Math1Chapter_4.pdf' },
  { id: 'ch5', title: 'Chapter 5: Vectors', pdf: '12_Math1Chapter_5.pdf' },
  { id: 'ch6', title: 'Chapter 6: Line and Plane', pdf: '12_Math1Chapter_6.pdf' },
  { id: 'ch7', title: 'Chapter 7: Linear Programming', pdf: '12_Math1Chapter_7.pdf' },
  { id: 'ch8', title: 'Answer', pdf: '12_Math1Answer.pdf' },
];

const math2_12 = [
  { id: 'ch1', title: 'Chapter 1: Differentiation', pdf: '12_Math2Chapter_1.pdf' },
  { id: 'ch2', title: 'Chapter 2: Applications of Derivatives', pdf: '12_Math2Chapter_2.pdf' },
  { id: 'ch3', title: 'Chapter 3: Indefinite Integration', pdf: '12_Math2Chapter_3.pdf' },
  { id: 'ch4', title: 'Chapter 4: Definite Integration', pdf: '12_Math2Chapter_4.pdf' },
  { id: 'ch5', title: 'Chapter 5: Application of Definite Integration', pdf: '12_Math2Chapter_5.pdf' },
  { id: 'ch6', title: 'Chapter 6: Differential Equations', pdf: '12_Math2Chapter_6.pdf' },
  { id: 'ch7', title: 'Chapter 7: Probability Distributions', pdf: '12_Math2Chapter_7.pdf' },
  { id: 'ch8', title: 'Chapter 8: Binomial Distribution', pdf: '12_Math2Chapter_8.pdf' },
  { id: 'ch9', title: 'Answer', pdf: '12_Math2Answer.pdf' },
];

const allChapters = {
  '11th': {
    Physics: physics11,
    Chemistry: chemistry11,
    Biology: biology11,
    'Mathematics I': math1_11,
    'Mathematics II': math2_11,
  },
  '12th': {
    Physics: physics12,
    Chemistry: chemistry12,
    Biology: biology12,
    'Mathematics I': math1_12,
    'Mathematics II': math2_12,
  },
};

export default function ChapterScreen({ navigation, route }) {
  const { studentClass, subjectTitle } = route.params;
  const classKey = studentClass?.includes('11') ? '11th' : '12th';
  const chapters = allChapters[classKey]?.[subjectTitle] || [];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>{`${subjectTitle} (${classKey})`}</Text>

        {chapters.length === 0 ? (
          <Text style={styles.noChaptersText}>No chapters available yet for this subject.</Text>
        ) : (
          <View style={styles.chapterContainer}>
            {chapters.map((chapter) => (
              <TouchableOpacity
                key={chapter.id}
                style={styles.chapterCard}
                onPress={() =>
                  navigation.navigate('SubjectPDF', {
                    pdfFile: chapter.pdf,
                    chapterTitle: chapter.title,
                    subjectName: subjectTitle,
                  })
                }
              >
            <Text style={styles.chapterText}>{chapter.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
        )}
    </ScrollView>
    </ScreenContainer >
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingVertical: 24 },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.purpleDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  noChaptersText: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 16,
  },
  chapterContainer: { flexDirection: 'column', alignItems: 'center' },
  chapterCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.purpleLight,
    elevation: 3,
  },
  chapterText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.purpleDark,
    textAlign: 'center',
  },
});
