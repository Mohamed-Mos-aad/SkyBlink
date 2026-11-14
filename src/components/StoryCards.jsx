import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Telescope,
} from 'lucide-react';

const STORIES = {
  '3i-atlas': {
    title: 'The Interstellar Voyager (زائر من وراء نظامنا الشمسي)',
    steps: [
      {
        step: 1,
        title: 'An Intruder Enters Our System',
        arabicTitle: 'جرم دخيل يدخل نظامنا الشمسي',
        description:
          '3I/ATLAS is an interstellar comet—an object originating from another star system completely outside our Sun’s gravitational domain. SPHEREx scanned this patch of sky in August 2025.',
        arabicDescription:
          '3I/ATLAS هو مذنب بين-نجمي نشأ حول نجم آخر خارج مجموعتنا الشمسية تماماً. التقط تلسكوب SPHEREx هذه المنطقة في أغسطس 2025.',
        action: 'Inspect the static stars in Epoch 1.',
        setFrameIndex: 0,
        enableBlink: false,
      },
      {
        step: 2,
        title: 'Thermal Glow in Near-Infrared',
        arabicTitle: 'التوهج الحراري بالأشعة تحت الحمراء',
        description:
          'Because SPHEREx observes at 0.75 to 5.0 µm, it detects warm water ice and carbon monoxide dust evaporating from the comet’s nucleus as sunlight warms it up.',
        arabicDescription:
          'يرصد تلسكوب SPHEREx الأطوال الموجية الحرارية، مما يتيح له كشف جليد الماء وغازات أول أكسيد الكربون المنبعثة من نواة المذنب عند اقترابه من حرارة الشمس.',
        action: 'Observe the faint infrared halo around the central core.',
        setFrameIndex: 2,
        enableBlink: false,
      },
      {
        step: 3,
        title: 'Spotting the Shift (Blink Comparator)',
        arabicTitle: 'اكتشاف الحركة: وميض المقارنة الفلكي',
        description:
          'Comparing August 2025 with December 2025 reveals that while every single background star remains fixed, 3I/ATLAS has moved across millions of kilometers of space!',
        arabicDescription:
          'بمقارنة صور أغسطس وديسمبر 2025، تظل جميع نجوم الخلفية ثابتة تماماً بينما يقفز المذنب قاطعاً ملايين الكيلومترات في الفضاء!',
        action: 'Activate Blink mode to witness the jump.',
        setFrameIndex: 5,
        enableBlink: true,
      },
    ],
  },
  '2024-yr4': {
    title: 'Near-Earth Asteroid Tracking (تعقب كويكب يقترب من الأرض)',
    steps: [
      {
        step: 1,
        title: 'The Search for Elusive Rocks',
        arabicTitle: 'البحث عن الصخور الفضائية السريعة',
        description:
          'Near-Earth asteroids reflect very little optical sunlight, making them nearly invisible to standard telescopes. SPHEREx thermal infrared reveals their warm rocky surfaces.',
        arabicDescription:
          'الكويكبات القريبة من الأرض تعكس نسبة ضئيلة جداً من الضوء المرئي، لكن الأشعة تحت الحمراء الحرارية تكشف حرارة أسطحها الصخرية بوضوح.',
        action: 'Look at the starting position of 2024 YR4.',
        setFrameIndex: 0,
        enableBlink: false,
      },
      {
        step: 2,
        title: 'High Apparent Velocity',
        arabicTitle: 'سرعة ظاهرية عالية في السماء',
        description:
          'Because 2024 YR4 is relatively close to Earth, its orbital motion produces a rapid linear shift across consecutive observation windows.',
        arabicDescription:
          'نظراً لقرب الكويكب نسبياً من مدار الأرض، تُظهر عمليات الرصد المتتالية إزاحة مكانية واضحة ترسم خطاً مستقيماً.',
        action: 'Follow the motion trail across time.',
        setFrameIndex: 2,
        enableBlink: false,
      },
      {
        step: 3,
        title: 'Predicting the Future Trajectory',
        arabicTitle: 'حساب المسار وتأمين الأرض',
        description:
          'By measuring precise celestial coordinates at each epoch, astronomers calculate orbital parameters to confirm whether the asteroid poses any future impact hazard.',
        arabicDescription:
          'بتحديد إحداثيات الجرم في كل لقطة، يتمكن علماء الفلك من حساب مداره بدقة متناهية والتأكد من عدم وجود أي خطر اصطدام بالأرض.',
        action: 'Compare the full trajectory with Blink.',
        setFrameIndex: 4,
        enableBlink: true,
      },
    ],
  },
  'wise-0855': {
    title: 'The Frozen Brown Dwarf (القزم البني المتجمد)',
    steps: [
      {
        step: 1,
        title: 'A World Without a Sun',
        arabicTitle: 'عالم متجمد بلا شمس',
        description:
          'WISE J0855 is not a planet or a star—it is a sub-stellar brown dwarf colder than ice (around -13°C). It emits almost zero visible light, glowing exclusively in deep infrared.',
        arabicDescription:
          'WISE J0855 ليس كوكباً ولا نجماً، بل هو قزم بني شبه نجمي أبرد من الجليد (نحو -13 مئوية). لا يبعث أي ضوء مرئي تقريباً، ويشع فقط بالأشعة تحت الحمراء العميقة.',
        action: 'Observe the cold thermal glow in Epoch 1.',
        setFrameIndex: 0,
        enableBlink: false,
      },
      {
        step: 2,
        title: 'High Proper Motion Solar Neighbor',
        arabicTitle: 'جار شمسي ذو حركة ذاتية فائقة السرعة',
        description:
          'Located only 7.5 light-years from Earth (the 4th closest star system), WISE 0855 races across the sky due to its sheer proximity to our Sun.',
        arabicDescription:
          'يقع على بعد 7.5 سنة ضوئية فقط من الأرض (رابع أقرب نظام للشمس)، وتجعله قربه الشديد يتحرك بسرعة ظاهرية هائلة مقارنة بالنجوم البعيدة.',
        action: 'Notice the position shift in mid-2025.',
        setFrameIndex: 2,
        enableBlink: false,
      },
      {
        step: 3,
        title: 'SPHEREx Atmospheric Spectroscopy',
        arabicTitle: 'التحليل الطيفي لغلافه الجوي',
        description:
          'By blinking through multiple SPHEREx epochs, scientists look for water clouds and atmospheric methane absorption features in this frozen alien atmosphere.',
        arabicDescription:
          'بمقارنة الفريمات المتتابعة عبر تلسكوب SPHEREx، يرصد العلماء سحب بخار الماء وامتصاص غاز الميثان في الغلاف الجوي لهذا الجرم الفريد.',
        action: 'Blink to confirm proper motion.',
        setFrameIndex: 3,
        enableBlink: true,
      },
    ],
  },
};

export default function StoryCards({ targetId, onStepAction, onClose }) {
  const story = STORIES[targetId] || STORIES['3i-atlas'];
  const [currentStep, setCurrentStep] = useState(0);

  const stepData = story.steps[currentStep];

  // Moving to Next or Previous step keeps the user INSIDE the Story view!
  const handleNext = () => {
    if (currentStep < story.steps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      const nextStep = story.steps[nextIdx];
      onStepAction(nextStep.setFrameIndex, nextStep.enableBlink, false); // false = stay in story!
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      const prevStep = story.steps[prevIdx];
      onStepAction(prevStep.setFrameIndex, prevStep.enableBlink, false); // false = stay in story!
    }
  };

  return (
    <div className="bg-[#0E163B] border border-[rgba(255,255,255,0.10)] rounded-xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col gap-5 font-sans text-[#F4F7FF] max-w-4xl mx-auto my-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.10)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#3D7BFF]/10 text-[#3D7BFF] border border-[#3D7BFF]/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#3D7BFF] uppercase">
              GUIDED CELESTIAL STORY
            </span>
            <h3 className="text-lg sm:text-xl font-display font-bold text-[#F4F7FF]">
              {story.title}
            </h3>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {story.steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                onStepAction(s.setFrameIndex, s.enableBlink, false); // stay in story!
              }}
              className={`h-2.5 rounded-full cursor-pointer transition-all duration-state ${idx === currentStep
                ? 'w-7 bg-[#3D7BFF] shadow-cosmic-glow'
                : 'w-2.5 bg-[#162256] hover:bg-[#3D7BFF]/50'
                }`}
              title={`Step ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex flex-col gap-4 py-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#3DDC97] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP {stepData.step} OF {story.steps.length}</span>
          </span>
          <span className="text-xs font-mono text-[#8392C4]">
            {stepData.arabicTitle}
          </span>
        </div>

        <h4 className="text-lg sm:text-xl font-display font-bold text-[#F4F7FF]">
          {stepData.title}
        </h4>

        <p className="text-sm sm:text-base text-[#B6C2E8] leading-relaxed">
          {stepData.description}
        </p>

        <p className="text-sm text-[#8392C4] leading-relaxed border-r-2 border-[#3D7BFF] pr-3 text-right" dir="rtl">
          {stepData.arabicDescription}
        </p>

        {/* Action Prompt Box */}
        <div className="mt-2 p-3.5 rounded-lg bg-[#162256] border border-[rgba(255,255,255,0.10)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5 text-xs font-mono text-[#F4F7FF]">
            {stepData.enableBlink ? (
              <Zap className="w-4 h-4 text-[#FF7A59] animate-pulse flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#3D7BFF] flex-shrink-0" />
            )}
            <span>Action: {stepData.action}</span>
          </div>

          <button
            onClick={() => onStepAction(stepData.setFrameIndex, stepData.enableBlink, true)} // true = open in telescope!
            className={`w-full sm:w-auto px-4 py-2 rounded-md text-xs font-mono font-bold transition-all duration-state flex items-center justify-center gap-1.5 ${stepData.enableBlink
              ? 'bg-[#FF7A59] hover:bg-[#FF8F73] text-white shadow-coral-glow'
              : 'bg-[#3D7BFF] hover:bg-[#6A9BFF] text-white shadow-cosmic-glow'
              }`}
          >
            <Telescope className="w-3.5 h-3.5" />
            <span>Apply & View in Telescope (تطبيق والانتقال للمرصد)</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.10)] pt-4">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.10)] bg-[#080D26] text-xs font-mono text-[#B6C2E8] hover:text-[#F4F7FF] hover:border-[#3D7BFF]/50 disabled:opacity-30 flex items-center gap-1.5 transition-all duration-state"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREVIOUS (السابق)</span>
        </button>

        <button
          onClick={onClose}
          className="text-xs font-mono text-[#8392C4] hover:text-[#F4F7FF] transition-colors"
        >
          Back to Observatory (العودة للمرصد)
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep === story.steps.length - 1}
          className="px-5 py-2 rounded-lg bg-[#3D7BFF] hover:bg-[#6A9BFF] text-white text-xs font-mono font-bold disabled:opacity-30 flex items-center gap-1.5 shadow-cosmic-glow transition-all duration-state"
        >
          <span>NEXT (التالي)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
