"use client"

import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Instructions() {
  const [currentPage, setCurrentPage] = useState(0)
  
  const pages = [
    {
      points: [
        {
          nepali: "नयाँ सवारी चालक अनुमतिपत्र तथा वर्ग थपका लागि यातायात व्यवस्था कार्यालय / यातायात व्यवस्था सेवा कार्यालयले विवरण रुजु एवंम् निवेदकको बायोमेट्रिक लिने कार्यहरु सार्वजनिक बिदा बाहेक हप्ताको प्रत्येक आइतबार, सोमबार, मंगलबार र बुधबारका दिन गर्ने गर्छ । यसका लागि निवेदकले यस प्रणालीमा आफ्नो निवेदक खाता बनाई प्रत्येक दिनको १५औं दिन अर्थात १६ दिनभित्र लाइसेन्सको वर्ग कोटा उपलब्ध भएको दिन सम्बन्धित कार्यालयमा अनलाइन आवेदन दर्ता गरी कार्यालय भिजिट डेट लिन सकिनेछ । तर प्रत्येक १६ औं दिनका लागि नयाँ आवेदन फाराम बिहान ७ बजे (शनिबार / आइतबार /सोमबार / मङ्गलबार) मात्र खुल्ला हुन्छ र कोटा नसकिएसम्म सातै दिन २४ घण्टासम्म फाराम भर्न सकिन्छ । निवेदकले आफ्नो निवेदक खाता एकभन्दा बढी बनाउनु हुँदैन ।",
          english: "Transport Management Offices / Transport Management Service Offices verify application details and take biometric of an applicant on every 4 days of a week (Sunday, Monday, Tuesday and Wednesday except public holiday) for New Driving License and Category Add. For this, an applicant has to register an online application against the office within each 16 days if quota of license category for the office is remaining by creating applicant account in the system at first. New application form will be opened for each 16th day from 7 AM and an applicant can apply the form online by 7 days and 24 hours till quota of license category is available. An applicant should not create more than one his/her applicant profile in the system."
        },
        {
          nepali: "अनलाइन आवेदन फाराम भर्दा निवेदकले आफ्नो मोवाइल नम्बर सहित अन्य विवरण सही प्रविष्ट गर्नु पर्दछ ।",
          english: "Correct information along with applicant's mobile number should be provided while filling up the online application form."
        },
        {
          nepali: "पहिचान परिचयपत्र (नागरिकता, पासपोर्ट र लाइसेन्स) को मूल स्क्यान गरिएको प्रतिलिपि अपलोड गर्नुपर्छ ।",
          english: "Original scanned copy of identity documents (citizenship, passport and license) must be uploaded."
        }
      ]
    },
    {
      points: [
        {
          nepali: "विवरण रुजु एवंम् बायोमेट्रिकका लागि प्राप्त गरेको कार्यालय भिजिट डेटमा निवेदक उपस्थित हुन नसकेको अवस्थामा सो मितिबाट १५ दिन पछि मात्र पुनः अनलाइन आवेदन भर्न सक्नेछ ।",
          english: "If the office visit date for biometric and verification of details is missed, the application can be re-submitted only after 15 days from the missed biometric visit date."
        },
        {
          nepali: "दर्ता गरिएको अनलाइन आवेदन फाराममा रहेको व्यक्तिगत विवरण जस्तै नाम, थर, नागरिकता विवरण, मोबाइल नं. र जन्म मिति मा कुनै त्रुटि भएमा उक्त फाराम रद्द हुनेछ । साथै वर्ग थपको लागि फाराम भर्दा प्राप्त गरिसकेको लाइसेन्सको वर्ग गलत प्रविष्ट भएमा पनि फाराम रद्द हुनेछ ।",
          english: "The submitted form will be cancelled if the personal details like name, citizenship details, mobile no. and date of birth and license category(ies) for add category are found incorrect."
        },
        {
          nepali: "सवारी चालक अनुमतिपत्रका लागि निवेदकको उमेर दुई पाङ्ग्रे सवारी (वर्ग A/K) को लागि १६ वर्ष, साना सवारी (वर्ग B) को लागि १८ वर्ष र अन्य सवारीका लागि २१ वर्ष पूरा भएको हुनुपर्नेछ ।",
          english: "Age of an applicant for two-wheelers (category A/K), small vehicles (category B) and other vehicles should be 16, 18 and 21 years respectively."
        }
      ]
    },
    {
      points: [
        {
          nepali: "सवारी चालकको स्मार्ट-कार्ड सवारी चालक अनुमतिपत्र सम्बन्धी विवरण license search मा क्लिक गरी हेर्न सकिन्छ ।",
          english: "Click on license search to see Smart-Card Driving License of a vehicle driver."
        },
        {
          nepali: "ट्रायल परीक्षामा असफल भएका परीक्षार्थीहरुले असफल भएको प्रथम मितिले ९० दिनाभित्र बढीमा ३ पटक सम्म रि-ट्रायल दिन सक्नेछन् ।",
          english: "An applicant can attend retrial exam maximum of three times within 90 days from the first trial failed date."
        },
        {
          nepali: "लाइसेन्स वर्ग पावरटिलर (D) , ट्र्रयाक्टर (E) , मिनिबस, ट्रक तथा बस (F, G) प्राप्त गरेका सवारी चालकले कुनैपनि अर्को वर्ग थप गर्दा लिखित परीक्षा अनिवार्य दिनुपर्दछ ।",
          english: "Applicants having license categories like D, E, F and G must take written exam, if you want to add another category."
        },
        {
          nepali: "बायोमेट्रिक दर्ता, लिखित तथा प्रयोगात्मक परीक्षाका लागि सम्बन्धित कार्यालयमा जाँदा अनिवार्य रूपमा सक्कल नागरिकता, सक्कल लाइसेन्स (वर्ग थपको हकमा) साथै लिएर मात्र जानुपर्छ ।",
          english: "Carry original citizenship and original license (for add category) with you while visiting office for biometric, written and practical exams."
        },
        {
          nepali: "प्रयोगात्मक परीक्षाका दिन परीक्षार्थीले अनिवार्य रूपमा जुत्ता लगाई आउनुपर्छ । साथै लिखित तथा प्रयोगात्मक परीक्षा केन्द्रहरुमा मोबाइल फोन निषेध गरिएको छ ।",
          english: "On the day of the practical examination, the candidates must wear shoes. Also, mobile phones are prohibited in written and practical examination centers."
        },
        {
          nepali: "आफ्नो स्मार्ट-कार्ड सवारी चालक अनुमतिपत्र छपाई भए/नभएको बारेमा जानकारीका लागि license print check क्लिक गरी जानकारी प्राप्त गर्न सकिन्छ ।",
          english: "Access license print check to check whether smart-card driving license is printed or not."
        }
      ]
    }
  ]

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentPage(prev => Math.min(prev + 1, pages.length - 1)),
    onSwipedRight: () => setCurrentPage(prev => Math.max(prev - 1, 0)),
  })

  return (
    <div className="w-full max-w-[95%] md:max-w-4xl lg:max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden min-h-[300px] md:min-h-[400px] relative my-4">
      <div className="p-4 md:p-8" {...handlers}>
        <div className="relative min-h-[250px] md:min-h-[300px] flex flex-col justify-between">
          <div className="space-y-6">
            {pages[currentPage].points?.map((point, index) => (
              <div key={index} className="flex">
                <div className="mr-4 font-semibold text-blue-600 min-w-[24px] pt-1">
                  {currentPage * 3 + index + 1}.
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-base md:text-lg text-gray-800 leading-relaxed">{point.nepali}</p>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">{point.english}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center space-x-2 md:space-x-3 mt-6 md:mt-8">
            {pages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                  index === currentPage ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentPage(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
        className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all ${
          currentPage === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
      </button>
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pages.length - 1))}
        className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all ${
          currentPage === pages.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
      </button>
    </div>
  )
}
