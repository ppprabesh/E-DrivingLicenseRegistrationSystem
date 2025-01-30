import BillbookRenewalForm from "@/components/BillbookRenewalForm";

export default function BillbookRegistrationPage(){
  return <>
  <div className="absolute inset-0 z-0">
        <img 
          src="/images/Emblem_of_Nepal.svg" 
          alt="Nepal Emblem" 
          className="w-full h-full object-cover opacity-10"
        />
      </div>
    <BillbookRenewalForm/>
  
  </>
}