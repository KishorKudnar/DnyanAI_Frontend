import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import { updateProgress } from '../utils/ProgressTracker';

const physics11 = [
  { id: 'ch1', title: 'Chapter 1: Units and Measurements' },
  { id: 'ch2', title: 'Chapter 2: Mathematical Methods' },
  { id: 'ch3', title: 'Chapter 3: Motion in a Plane' },
  { id: 'ch4', title: 'Chapter 4: Laws of Motion' },
  { id: 'ch5', title: 'Chapter 5: Gravitation' },
  { id: 'ch6', title: 'Chapter 6: Mechanical Properties of Solids' },
  { id: 'ch7', title: 'Chapter 7: Thermal Properties of Matter' },
  { id: 'ch8', title: 'Chapter 8: Sound' },
  { id: 'ch9', title: 'Chapter 9: Optics' },
  { id: 'ch10', title: 'Chapter 10: Electrostatics' },
  { id: 'ch11', title: 'Chapter 11: Electric Current Through Conductors' },
  { id: 'ch12', title: 'Chapter 12: Magnetism' },
  { id: 'ch13', title: 'Chapter 13: Electromagnetic Waves and Communication System' },
  { id: 'ch14', title: 'Chapter 14: Semiconductors' },
];

const physics12 = [
  { id: 'ch1', title: 'Chapter 1: Rotational Dynamics' },
  { id: 'ch2', title: 'Chapter 2: Mechanical Properties of Fluids' },
  { id: 'ch3', title: 'Chapter 3: Kinetic Theory of Gases and Radiation' },
  { id: 'ch4', title: 'Chapter 4: Thermodynamics' },
  { id: 'ch5', title: 'Chapter 5: Oscillations' },
  { id: 'ch6', title: 'Chapter 6: Superposition of Waves' },
  { id: 'ch7', title: 'Chapter 7: Wave Optics' },
  { id: 'ch8', title: 'Chapter 8: Electrostatics' },
  { id: 'ch9', title: 'Chapter 9: Current Electricity' },
  { id: 'ch10', title: 'Chapter 10: Magnetic Fields due to Electric Current' },
  { id: 'ch11', title: 'Chapter 11: Magnetic Materials' },
  { id: 'ch12', title: 'Chapter 12: Electromagnetic induction' },
  { id: 'ch13', title: 'Chapter 13: AC Circuits' },
  { id: 'ch14', title: 'Chapter 14: Dual Nature of Radiation and Matter' },
  { id: 'ch15', title: 'Chapter 15: Structure of Atoms and Nuclei' },
  { id: 'ch16', title: 'Chapter 16: Semiconductor Devices' },
];

const chemistry11 = [
  { id: 'ch1', title: 'Chapter 1: Some Basic Concepts of Chemistry' },
  { id: 'ch2', title: 'Chapter 2: Introduction to Analytical Chemistry' },
  { id: 'ch3', title: 'Chapter 3: Some Analytical Techniques' },
  { id: 'ch4', title: 'Chapter 4: Structure of Atom' },
  { id: 'ch5', title: 'Chapter 5: Chemical Bonding' },
  { id: 'ch6', title: 'Chapter 6: Redox Reactions' },
  { id: 'ch7', title: 'Chapter 7: Modern Periodic Table' },
  { id: 'ch8', title: 'Chapter 8: Elements of Group 1 and 2' },
  { id: 'ch9', title: 'Chapter 9: Elements of Group 13, 14 and 15' },
  { id: 'ch10', title: 'Chapter 10: States of Matter' },
  { id: 'ch11', title: 'Chapter 11: Adsorption and Colloids' },
  { id: 'ch12', title: 'Chapter 12: Chemical Equilibrium' },
  { id: 'ch13', title: 'Chapter 13: Nuclear Chemistry and Radioactivity' },
  { id: 'ch14', title: 'Chapter 14: Basic Principles of Organic Chemistry' },
  { id: 'ch15', title: 'Chapter 15: Hydrocarbons' },
  { id: 'ch16', title: 'Chapter 16: Chemistry in Everyday Life' },
];

const chemistry12 = [
  { id: 'ch1', title: 'Chapter 1: Solid State' },
  { id: 'ch2', title: 'Chapter 2: Solutions' },
  { id: 'ch3', title: 'Chapter 3: Ionic Equilibria' },
  { id: 'ch4', title: 'Chapter 4: Chemical Thermodynamics' },
  { id: 'ch5', title: 'Chapter 5: Electrochemistry' },
  { id: 'ch6', title: 'Chapter 6: Chemical Kinetics' },
  { id: 'ch7', title: 'Chapter 7: Elements of Groups 16, 17 and 18' },
  { id: 'ch8', title: 'Chapter 8: Transition and Inner transition Elements' },
  { id: 'ch9', title: 'Chapter 9: Coordination Compounds' },
  { id: 'ch10', title: 'Chapter 10: Halogen Derivatives' },
  { id: 'ch11', title: 'Chapter 11: Alcohols, Phenols and Ethers' },
  { id: 'ch12', title: 'Chapter 12: Aldehydes, Ketones and Carboxylic acids' },
  { id: 'ch13', title: 'Chapter 13: Amines' },
  { id: 'ch14', title: 'Chapter 14: Biomolecules' },
  { id: 'ch15', title: 'Chapter 15: Introduction to Polymer Chemistry' },
  { id: 'ch16', title: 'Chapter 16: Green Chemistry and Nanochemistry' },
];

const biology11 = [
  { id: 'ch1', title: 'Chapter 1: Living World' },
  { id: 'ch2', title: 'Chapter 2: Systematics of Living Organisms' },
  { id: 'ch3', title: 'Chapter 3: Kingdom Plantae' },
  { id: 'ch4', title: 'Chapter 4: Kingdom Animalia' },
  { id: 'ch5', title: 'Chapter 5: Cell Structure and Organization' },
  { id: 'ch6', title: 'Chapter 6: Biomolecules' },
  { id: 'ch7', title: 'Chapter 7: Cell Division' },
  { id: 'ch8', title: 'Chapter 8: Plant Tissues and Anatomy' },
  { id: 'ch9', title: 'Chapter 9: Morphology of Flowering Plants' },
  { id: 'ch10', title: 'Chapter 10: Animal Tissue' },
  { id: 'ch11', title: 'Chapter 11: Study of Animal Type : Cockroach' },
  { id: 'ch12', title: 'Chapter 12: Photosynthesis' },
  { id: 'ch13', title: 'Chapter 13: Respiration and Energy Transfer' },
  { id: 'ch14', title: 'Chapter 14: Human Nutrition' },
  { id: 'ch15', title: 'Chapter 15: Excretion and Osmoregulation' },
  { id: 'ch16', title: 'Chapter 16: Skeleton and Movement' },
];

const biology12 = [
  { id: 'ch1', title: 'Chapter 1: Reproduction in Lower and Higher Plants' },
  { id: 'ch2', title: 'Chapter 2: Reproduction in Lower and Higher Animals' },
  { id: 'ch3', title: 'Chapter 3: Inheritance and Variation' },
  { id: 'ch4', title: 'Chapter 4: Molecular Basis of Inheritance' },
  { id: 'ch5', title: 'Chapter 5: Origin and Evolution of Life' },
  { id: 'ch6', title: 'Chapter 6: Plant Water Relation' },
  { id: 'ch7', title: 'Chapter 7: Plant Growth and Mineral Nutrition' },
  { id: 'ch8', title: 'Chapter 8: Respiration and Circulation' },
  { id: 'ch9', title: 'Chapter 9: Control and Co-ordination' },
  { id: 'ch10', title: 'Chapter 10: Human Health and Diseases' },
  { id: 'ch11', title: 'Chapter 11: Enhancement of Food Production' },
  { id: 'ch12', title: 'Chapter 12: Biotechnology' },
  { id: 'ch13', title: 'Chapter 13: Organisms and Populations' },
  { id: 'ch14', title: 'Chapter 14: Ecosystems and Energy Flow' },
  { id: 'ch15', title: 'Chapter 15: Biodiversity, Conservation and Environmental Issues' },
];

const math1_11 = [
  { id: 'ch1', title: 'Chapter 1: Angle and its Measurement' },
  { id: 'ch2', title: 'Chapter 2: Trigonometry - I' },
  { id: 'ch3', title: 'Chapter 3: Trigonometry - II' },
  { id: 'ch4', title: 'Chapter 4: Determinants and Matrices' },
  { id: 'ch5', title: 'Chapter 5: Straight Line' },
  { id: 'ch6', title: 'Chapter 6: Circle' },
  { id: 'ch7', title: 'Chapter 7: Conic Sections' },
  { id: 'ch8', title: 'Chapter 8: Measures of Dispersion' },
  { id: 'ch9', title: 'Chapter 9: Probability' },
];

const math2_11 = [
  { id: 'ch1', title: 'Chapter 1: Partition Values' },
  { id: 'ch2', title: 'Chapter 2: Measures of Dispersion' },
  { id: 'ch3', title: 'Chapter 3: Skewness' },
  { id: 'ch4', title: 'Chapter 4: Bivariate Frequency Distribution and Chi Square Statistic' },
  { id: 'ch5', title: 'Chapter 5: Correlation' },
  { id: 'ch6', title: 'Chapter 6: Permutations and Combinations' },
  { id: 'ch7', title: 'Chapter 7: Probability' },
  { id: 'ch8', title: 'Chapter 8: Linear Inequations' },
  { id: 'ch9', title: 'Chapter 9: Commercial Mathematics' },
];

const math1_12 = [
  { id: 'ch1', title: 'Chapter 1: Mathematical Logic' },
  { id: 'ch2', title: 'Chapter 2: Matrices' },
  { id: 'ch3', title: 'Chapter 3: Trigonometric Functions' },
  { id: 'ch4', title: 'Chapter 4: Pair of Straight Lines' },
  { id: 'ch5', title: 'Chapter 5: Vectors' },
  { id: 'ch6', title: 'Chapter 6: Line and Plane' },
  { id: 'ch7', title: 'Chapter 7: Linear Programming' },
];

const math2_12 = [
  { id: 'ch1', title: 'Chapter 1: Differentiation' },
  { id: 'ch2', title: 'Chapter 2: Applications of Derivatives' },
  { id: 'ch3', title: 'Chapter 3: Indefinite Integration' },
  { id: 'ch4', title: 'Chapter 4: Definite Integration' },
  { id: 'ch5', title: 'Chapter 5: Application of Definite Integration' },
  { id: 'ch6', title: 'Chapter 6: Differential Equations' },
  { id: 'ch7', title: 'Chapter 7: Probability Distributions' },
  { id: 'ch8', title: 'Chapter 8: Binomial Distribution' },
];

const allChaptersQuiz = {
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

export default function ChapterQuizScreen({ navigation, route }) {
  const { studentClass, subjectTitle } = route.params;

  const classKey = studentClass?.includes('11') ? '11th' : '12th';

  const chapters = allChaptersQuiz[classKey]?.[subjectTitle] || [];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>{`${subjectTitle} (${classKey})`}</Text>

        {chapters.length === 0 ? (
          <Text style={styles.noChaptersText}>No quizzes available.</Text>
        ) : (
          <View style={styles.chapterContainer}>
            {chapters.map((chapter) => (
              <TouchableOpacity
                key={chapter.id}
                style={styles.chapterCard}
                onPress={async () => {
                  await updateProgress(subjectTitle, 'test');

                  navigation.navigate('QuizScreen', {
                    quizId: chapter.id,
                    quizTitle: chapter.title,
                    subjectTitle,
                  });
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.chapterText}>{chapter.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
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
  chapterContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
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
