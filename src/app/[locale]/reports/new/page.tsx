// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useParams } from "next/navigation";

// // ReportTypeOption component to make code more modular
// interface ReportTypeOptionProps {
//   id: string;
//   value: string;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   isSelected: boolean;
//   onClick: () => void;
//   iconBgColor: string;
//   iconColor: string;
// }

// // Component for form input fields
// interface FormFieldProps {
//   id: string;
//   label: string;
//   placeholder: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
//   required?: boolean;
//   type?: string;
//   as?: "input" | "textarea" | "select";
//   children?: React.ReactNode;
//   description?: string;
// }

// function FormField({
//   id,
//   label,
//   placeholder,
//   value,
//   onChange,
//   required = false,
//   type = "text",
//   as = "input",
//   children,
//   description
// }: FormFieldProps) {
//   const InputComponent = as === "textarea" ? Textarea : Input;

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//       <label 
//         htmlFor={id} 
//         style={{ 
//           fontSize: "0.9375rem", 
//           fontWeight: "600", 
//           marginBottom: "0.25rem",
//           color: "hsl(var(--foreground))"
//         }}
//       >
//         {label}
//       </label>

//       {as === "select" ? (
//         <select
//           id={id}
//           value={value}
//           onChange={onChange}
//           style={{
//             fontSize: "1rem",
//             padding: "0.75rem 1rem",
//             borderRadius: "0.375rem",
//             border: "1px solid hsla(var(--border) / 0.5)",
//             backgroundColor: "hsla(var(--background) / 0.5)",
//             transition: "border-color 0.2s, box-shadow 0.2s",
//             height: "2.75rem",
//             width: "100%"
//           }}
//           required={required}
//         >
//           {children}
//         </select>
//       ) : (
//         <InputComponent
//           id={id}
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           style={{
//             fontSize: "1rem",
//             padding: "0.75rem 1rem",
//             borderRadius: "0.375rem",
//             border: "1px solid hsla(var(--border) / 0.5)",
//             backgroundColor: "hsla(var(--background) / 0.5)",
//             transition: "border-color 0.2s, box-shadow 0.2s"
//           }}
//           required={required}
//         />
//       )}

//       {description && (
//         <p style={{ 
//           fontSize: "0.75rem", 
//           color: "hsl(var(--muted-foreground))",
//           marginTop: "0.25rem"
//         }}>
//           {description}
//         </p>
//       )}
//     </div>
//   );
// }

// // Component for report type options to reduce duplication
// function ReportTypeOption({
//   id,
//   value,
//   title,
//   description,
//   icon,
//   isSelected,
//   onClick,
//   iconBgColor,
//   iconColor
// }: ReportTypeOptionProps) {
//   return (
//     <div 
//       onClick={onClick}
//       style={{
//         padding: "1.25rem",
//         borderRadius: "0.75rem",
//         border: "1px solid",
//         borderColor: isSelected 
//           ? "hsl(var(--primary))" 
//           : "hsla(var(--border) / 0.5)",
//         backgroundColor: isSelected 
//           ? "hsla(var(--primary) / 0.05)" 
//           : "hsla(var(--card) / 0.8)",
//         cursor: "pointer",
//         transition: "all 0.2s ease",
//         display: "flex",
//         flexDirection: "column",
//         gap: "0.75rem"
//       }}
//     >
//       <div style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "0.75rem"
//       }}>
//         <div style={{
//           width: "2.5rem",
//           height: "2.5rem",
//           borderRadius: "50%",
//           backgroundColor: iconBgColor,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: iconColor
//         }}>
//           {icon}
//         </div>
//         <div style={{
//           fontWeight: "600",
//           fontSize: "1.125rem"
//         }}>{title}</div>
//       </div>
//       <p style={{
//         fontSize: "0.875rem",
//         color: "hsl(var(--muted-foreground))",
//         lineHeight: 1.5
//       }}>
//         {description}
//       </p>
//       <input 
//         type="radio" 
//         id={id} 
//         name="reportType"
//         value={value}
//         checked={isSelected}
//         onChange={onClick}
//         style={{ display: "none" }}
//       />
//     </div>
//   );
// }

// export default function NewReportPage() {
//   type FormDataType = {
//     title: string;
//     businessName: string;
//     location: string;
//     category: string;
//     description: string;
//     photo: File | null;
//     contact: string;
//     reportType: string;
//     priceBefore: string;
//     priceAfter: string;
//     receiptIssue: string;
//     suspiciousActivity: string;
//     unauthorizedIssue: string;
//     item: string;
//   };

//   const [formData, setFormData] = useState<FormDataType>({
//     title: "",
//     businessName: "",
//     location: "",
//     category: "",
//     description: "",
//     photo: null,
//     contact: "",
//     reportType: "",
//     priceBefore: "",
//     priceAfter: "",
//     receiptIssue: "",
//     suspiciousActivity: "",
//     unauthorizedIssue: "",
//     item: ""
//   });

//   const [windowWidth, setWindowWidth] = useState(0);
//   const [translations, setTranslations] = useState<any>({});

//   // Get locale from params - this follows the same pattern as your BusinessesPage
//   const params = useParams();
//   const locale = (params.locale as string) || 'en';

//   // Handle window resize effect - only runs client-side
//   useEffect(() => {
//     // Make sure we're in the browser environment
//     if (typeof window !== 'undefined') {
//       // Set initial width
//       setWindowWidth(window.innerWidth);

//       // Add resize listener
//       const handleResize = () => {
//         setWindowWidth(window.innerWidth);
//       };

//       window.addEventListener('resize', handleResize);

//       // Cleanup
//       return () => {
//         window.removeEventListener('resize', handleResize);
//       };
//     }
//   }, []);

//   // Load translations
//   useEffect(() => {
//     const loadTranslations = async () => {
//       try {
//         // Try to load the translations for the current locale
//         const translationsModule = await import(`../../../../../messages/reports/new-report.${locale}.json`);
//         setTranslations(translationsModule.default);
//       } catch (error) {
//         // Fallback to English if the requested locale is not available
//         console.error(`Failed to load translations for locale ${locale}, falling back to English`, error);
//         const fallbackModule = await import(`../../../../../messages/reports/new-report.en.json`);
//         setTranslations(fallbackModule.default);
//       }
//     };

//     loadTranslations();
//   }, [locale]);

//   // Translation helper function
//   const t = (key: string, params?: Record<string, any>): string => {
//     if (!translations) return key; // Return the key if translations are not loaded yet

//     const keys = key.split('.');
//     let value = translations;

//     for (const k of keys) {
//       if (value && typeof value === 'object' && k in value) {
//         value = value[k];
//       } else {
//         return key; // Return the key if translation is not found
//       }
//     }

//     if (typeof value === 'string' && params) {
//       // Replace parameters in the translation string
//       return Object.entries(params).reduce((str, [param, val]) => {
//         return str.replace(`{${param}}`, String(val));
//       }, value);
//     }

//     return value;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData({ ...formData, photo: e.target.files[0] });
//     }
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // In a real app, this would submit the data to an API
//     console.log("Submitting report:", formData);
//     alert("Thank you for submitting your report! It will be reviewed by our team.");
//     // Reset form or redirect
//   };

//   return (
//     <div style={{ 
//       display: "flex", 
//       flexDirection: "column", 
//       padding: "2rem 1.5rem 4rem",
//       backgroundColor: "hsl(var(--background))"
//     }}>
//       {/* Header Section */}
//       <div style={{
//         position: "relative",
//         width: "100%",
//         marginBottom: "2.5rem",
//         maxWidth: "1000px",
//         margin: "0 auto 3rem"
//       }}>
//         <div style={{
//           textAlign: "center",
//           padding: "2rem",
//           borderRadius: "0.75rem",
//           backgroundColor: "hsla(var(--primary) / 0.05)",
//           marginBottom: "2rem"
//         }}>
//           <h1 style={{
//             fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
//             fontWeight: "bold",
//             marginBottom: "1rem",
//             fontFamily: "var(--font-heading)",
//             background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--foreground)))",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent" as any,
//             backgroundClip: "text",
//             color: "transparent" // Using color instead of textFillColor for TypeScript compatibility
//           }}>
//             {t('title')}
//           </h1>
//           <p style={{
//             fontSize: windowWidth >= 768 ? "1.125rem" : "1rem",
//             color: "hsl(var(--muted-foreground))",
//             maxWidth: "32rem",
//             margin: "0 auto",
//             lineHeight: "1.5"
//           }}>
//             {t('subtitle')}
//           </p>
//         </div>
//       </div>

//       <div className="container" style={{ 
//         maxWidth: "800px", 
//         margin: "0 auto"
//       }}>
//         <Card style={{
//           boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//           borderRadius: "0.75rem",
//           overflow: "hidden"
//         }}>
//           <CardHeader style={{
//             borderBottom: "1px solid hsla(var(--border) / 0.5)",
//             padding: "1.5rem",
//             backgroundColor: "hsla(var(--muted) / 0.1)"
//           }}>
//             <div style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               marginBottom: "0.75rem"
//             }}>
//               <div style={{
//                 backgroundColor: "hsla(var(--primary) / 0.1)",
//                 borderRadius: "50%",
//                 width: "2.5rem",
//                 height: "2.5rem",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "hsl(var(--primary))"
//               }}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
//                   <polyline points="14 2 14 8 20 8"/>
//                 </svg>
//               </div>
//               <CardTitle style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>{t('form.reportDetails.title')}</CardTitle>
//             </div>
//             <CardDescription style={{ lineHeight: 1.6, fontSize: "1rem" }}>
//               {t('form.reportDetails.description')}
//             </CardDescription>
//           </CardHeader>
//           <CardContent style={{ padding: "2rem 1.5rem" }}>
//             <form className="space-y-6" onSubmit={handleSubmit}>
//               <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
//                 {/* Basic Information Fields - using FormField component */}
//                 <FormField
//                   id="title"
//                   label={t('form.fields.title.label')}
//                   placeholder={t('form.fields.title.placeholder')}
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                 />

//                 <FormField
//                   id="businessName"
//                   label={t('form.fields.businessName.label')}
//                   placeholder={t('form.fields.businessName.placeholder')}
//                   value={formData.businessName}
//                   onChange={handleChange}
//                   required
//                 />

//                 <FormField
//                   id="location"
//                   label={t('form.fields.location.label')}
//                   placeholder={t('form.fields.location.placeholder')}
//                   value={formData.location}
//                   onChange={handleChange}
//                   required
//                 />

//                 <FormField
//                   id="category"
//                   label={t('form.fields.category.label')}
//                   placeholder=""
//                   value={formData.category}
//                   onChange={handleChange}
//                   required
//                   as="select"
//                 >
//                   <option value="">{t('form.fields.category.options.default')}</option>
//                   <option value="Groceries">{t('form.fields.category.options.groceries')}</option>
//                   <option value="Fuel">{t('form.fields.category.options.fuel')}</option>
//                   <option value="Essentials">{t('form.fields.category.options.essentials')}</option>
//                   <option value="Electronics">{t('form.fields.category.options.electronics')}</option>
//                   <option value="Restaurants">{t('form.fields.category.options.restaurants')}</option>
//                   <option value="Accommodation">{t('form.fields.category.options.accommodation')}</option>
//                   <option value="No Receipt">{t('form.fields.category.options.noReceipt')}</option>
//                   <option value="Other">{t('form.fields.category.options.other')}</option>
//                 </FormField>

//                 {/* Report Type */}
//                 <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
//                   <label 
//                     htmlFor="reportType" 
//                     style={{ 
//                       fontSize: "1.125rem", 
//                       fontWeight: "600", 
//                       color: "hsl(var(--foreground))",
//                       fontFamily: "var(--font-heading)"
//                     }}
//                   >
//                     {t('form.fields.reportType.label')}
//                   </label>

//                   <div style={{
//                     display: "grid",
//                     gridTemplateColumns: windowWidth >= 768 ? "repeat(2, 1fr)" : "1fr",
//                     gap: "1rem"
//                   }}>
//                     {/* Report type options displayed using the component */}
//                     <ReportTypeOption
//                       id="reportType-price-gouging"
//                       value="price_gouging"
//                       title={t('form.reportTypes.priceGouging.title')}
//                       description={t('form.reportTypes.priceGouging.description')}
//                       isSelected={formData.reportType === "price_gouging"}
//                       onClick={() => setFormData({...formData, reportType: "price_gouging"})}
//                       iconBgColor="hsla(var(--destructive) / 0.1)"
//                       iconColor="hsl(var(--destructive))"
//                       icon={(
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
//                           <path d="M3 6h18"/>
//                           <path d="M16 10a4 4 0 0 1-8 0"/>
//                         </svg>
//                       )}
//                     />

//                     <ReportTypeOption
//                       id="reportType-no-receipt"
//                       value="no_receipt"
//                       title={t('form.reportTypes.noReceipt.title')}
//                       description={t('form.reportTypes.noReceipt.description')}
//                       isSelected={formData.reportType === "no_receipt"}
//                       onClick={() => setFormData({...formData, reportType: "no_receipt"})}
//                       iconBgColor="hsla(var(--destructive) / 0.1)"
//                       iconColor="hsl(var(--destructive))"
//                       icon={(
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <rect width="18" height="18" x="3" y="3" rx="2" />
//                           <line x1="9" x2="15" y1="9" y2="9" />
//                           <line x1="9" x2="15" y1="15" y2="15" />
//                         </svg>
//                       )}
//                     />

//                     <ReportTypeOption
//                       id="reportType-suspicious"
//                       value="suspicious_activity"
//                       title={t('form.reportTypes.suspiciousActivity.title')}
//                       description={t('form.reportTypes.suspiciousActivity.description')}
//                       isSelected={formData.reportType === "suspicious_activity"}
//                       onClick={() => setFormData({...formData, reportType: "suspicious_activity"})}
//                       iconBgColor="hsla(var(--warning) / 0.1)"
//                       iconColor="hsl(var(--warning))"
//                       icon={(
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
//                         </svg>
//                       )}
//                     />

//                     <ReportTypeOption
//                       id="reportType-unauthorized"
//                       value="unauthorized_business"
//                       title={t('form.reportTypes.unauthorizedBusiness.title')}
//                       description={t('form.reportTypes.unauthorizedBusiness.description')}
//                       isSelected={formData.reportType === "unauthorized_business"}
//                       onClick={() => setFormData({...formData, reportType: "unauthorized_business"})}
//                       iconBgColor="hsla(var(--primary) / 0.1)"
//                       iconColor="hsl(var(--primary))"
//                       icon={(
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
//                           <circle cx="12" cy="12" r="3"/>
//                         </svg>
//                       )}
//                     />

//                     <ReportTypeOption
//                       id="reportType-false-advertising"
//                       value="false_advertising"
//                       title={t('form.reportTypes.falseAdvertising.title')}
//                       description={t('form.reportTypes.falseAdvertising.description')}
//                       isSelected={formData.reportType === "false_advertising"}
//                       onClick={() => setFormData({...formData, reportType: "false_advertising"})}
//                       iconBgColor="hsla(var(--warning) / 0.1)"
//                       iconColor="hsl(var(--warning))"
//                       icon={(
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="m3 8 4-4 4 4"/>
//                           <path d="M11 12H3"/>
//                           <path d="m9 16 4 4 4-4"/>
//                           <path d="M20 12h-8"/>
//                         </svg>
//                       )}
//                     />

//                     <ReportTypeOption
//                       id="reportType-hidden-fees"
//                       value="hidden_fees"
//                       title={t('form.reportTypes.hiddenFees.title')}
//                       description={t('form.reportTypes.hiddenFees.description')}
//                       isSelected={formData.reportType === "hidden_fees"}
//                       onClick={() => setFormData({...formData, reportType: "hidden_fees"})}
//                       iconBgColor="hsla(var(--destructive) / 0.1)"
//                       iconColor="hsl(var(--destructive))"
//                       icon={(
//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <circle cx="12" cy="12" r="10"/>
//                           <path d="M12 8v4"/>
//                           <path d="M12 16h.01"/>
//                         </svg>
//                       )}
//                     />

//                     {/* Other Option */}
//                     <div 
//                       onClick={() => setFormData({...formData, reportType: "other"})}
//                       style={{
//                         padding: "1.25rem",
//                         borderRadius: "0.75rem",
//                         border: "1px solid",
//                         borderColor: formData.reportType === "other" 
//                           ? "hsl(var(--primary))" 
//                           : "hsla(var(--border) / 0.5)",
//                         backgroundColor: formData.reportType === "other" 
//                           ? "hsla(var(--primary) / 0.05)" 
//                           : "hsla(var(--card) / 0.8)",
//                         cursor: "pointer",
//                         transition: "all 0.2s ease",
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "0.75rem"
//                       }}
//                     >
//                       <div style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "0.75rem"
//                       }}>
//                         <div style={{
//                           width: "2.5rem",
//                           height: "2.5rem",
//                           borderRadius: "50%",
//                           backgroundColor: "hsla(var(--muted) / 0.2)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           color: "hsl(var(--muted-foreground))"
//                         }}>
//                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                             <circle cx="12" cy="12" r="10"/>
//                             <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
//                             <path d="M12 17h.01"/>
//                           </svg>
//                         </div>
//                         <div style={{
//                           fontWeight: "600",
//                           fontSize: "1.125rem"
//                         }}>Other Consumer Issue</div>
//                       </div>
//                       <p style={{
//                         fontSize: "0.875rem",
//                         color: "hsl(var(--muted-foreground))",
//                         lineHeight: 1.5
//                       }}>
//                         Report any other unfair business practices not listed above
//                       </p>
//                       <input 
//                         type="radio" 
//                         id="reportType-other" 
//                         name="reportType"
//                         value="other"
//                         checked={formData.reportType === "other"}
//                         onChange={() => setFormData({...formData, reportType: "other"})}
//                         style={{ display: "none" }}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Hide the old dropdown since we're using the new visual selector */}
//                 <div style={{ display: "none" }}>
//                   <select 
//                     id="reportType" 
//                     value={formData.reportType}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select issue type</option>
//                     <option value="price_gouging">Price Gouging</option>
//                     <option value="no_receipt">No Receipt Provided</option>
//                     <option value="suspicious_activity">Suspicious Activity</option>
//                     <option value="unauthorized_business">Unauthorized Business Behavior</option>
//                     <option value="false_advertising">False Advertising</option>
//                     <option value="hidden_fees">Hidden Fees</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 {/* Issue Details - conditional based on report type */}
//                 {formData.reportType === 'price_gouging' && (
//                   <>
//                     {/* Price Before */}
//                     <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//                       <label 
//                         htmlFor="priceBefore" 
//                         style={{ 
//                           fontSize: "0.9375rem", 
//                           fontWeight: "600", 
//                           marginBottom: "0.25rem",
//                           color: "hsl(var(--foreground))"
//                         }}
//                       >
//                         Original Price *
//                       </label>
//                       <Input 
//                         id="priceBefore" 
//                         value={formData.priceBefore}
//                         onChange={handleChange}
//                         placeholder="e.g. $1.99" 
//                         style={{
//                           fontSize: "1rem",
//                           padding: "0.75rem 1rem",
//                           borderRadius: "0.375rem",
//                           border: "1px solid hsla(var(--border) / 0.5)",
//                           backgroundColor: "hsla(var(--background) / 0.5)",
//                           transition: "border-color 0.2s, box-shadow 0.2s"
//                         }}
//                         required={formData.reportType === 'price_gouging'}
//                       />
//                     </div>

//                     {/* Price After */}
//                     <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//                       <label 
//                         htmlFor="priceAfter" 
//                         style={{ 
//                           fontSize: "0.9375rem", 
//                           fontWeight: "600", 
//                           marginBottom: "0.25rem",
//                           color: "hsl(var(--foreground))"
//                         }}
//                       >
//                         Gouged Price *
//                       </label>
//                       <Input 
//                         id="priceAfter" 
//                         value={formData.priceAfter}
//                         onChange={handleChange}
//                         placeholder="e.g. $5.99" 
//                         style={{
//                           fontSize: "1rem",
//                           padding: "0.75rem 1rem",
//                           borderRadius: "0.375rem",
//                           border: "1px solid hsla(var(--border) / 0.5)",
//                           backgroundColor: "hsla(var(--background) / 0.5)",
//                           transition: "border-color 0.2s, box-shadow 0.2s"
//                         }}
//                         required={formData.reportType === 'price_gouging'}
//                       />
//                     </div>
//                   </>
//                 )}

//                 {formData.reportType === 'no_receipt' && (
//                   <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//                     <label 
//                       htmlFor="receiptIssue" 
//                       style={{ 
//                         fontSize: "0.9375rem", 
//                         fontWeight: "600", 
//                         marginBottom: "0.25rem",
//                         color: "hsl(var(--foreground))"
//                       }}
//                     >
//                       Receipt Issue Type *
//                     </label>
//                     <select 
//                       id="receiptIssue" 
//                       value={formData.receiptIssue}
//                       onChange={handleChange}
//                       style={{
//                         fontSize: "1rem",
//                         padding: "0.75rem 1rem",
//                         borderRadius: "0.375rem",
//                         border: "1px solid hsla(var(--border) / 0.5)",
//                         backgroundColor: "hsla(var(--background) / 0.5)",
//                         transition: "border-color 0.2s, box-shadow 0.2s",
//                         height: "2.75rem",
//                         width: "100%"
//                       }}
//                       required={formData.reportType === 'no_receipt'}
//                     >
//                       <option value="">Select receipt issue</option>
//                       <option value="no_receipt">No receipt offered at all</option>
//                       <option value="refused_receipt">Receipt refused when requested</option>
//                       <option value="incomplete_receipt">Incomplete/illegible receipt</option>
//                       <option value="verbal_receipt">Only verbal confirmation, no paper receipt</option>
//                       <option value="handwritten">Suspicious handwritten receipt</option>
//                     </select>
//                   </div>
//                 )}

//                 {formData.reportType === 'suspicious_activity' && (
//                   <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//                     <label 
//                       htmlFor="suspiciousActivity" 
//                       style={{ 
//                         fontSize: "0.9375rem", 
//                         fontWeight: "600", 
//                         marginBottom: "0.25rem",
//                         color: "hsl(var(--foreground))"
//                       }}
//                     >
//                       Suspicious Activity Type *
//                     </label>
//                     <select 
//                       id="suspiciousActivity" 
//                       value={formData.suspiciousActivity}
//                       onChange={handleChange}
//                       style={{
//                         fontSize: "1rem",
//                         padding: "0.75rem 1rem",
//                         borderRadius: "0.375rem",
//                         border: "1px solid hsla(var(--border) / 0.5)",
//                         backgroundColor: "hsla(var(--background) / 0.5)",
//                         transition: "border-color 0.2s, box-shadow 0.2s",
//                         height: "2.75rem",
//                         width: "100%"
//                       }}
//                       required={formData.reportType === 'suspicious_activity'}
//                     >
//                       <option value="">Select suspicious activity</option>
//                       <option value="card_skimming">Credit card skimming</option>
//                       <option value="counterfeit">Selling counterfeit products</option>
//                       <option value="identity_theft">Identity theft concerns</option>
//                       <option value="data_collection">Excessive personal data collection</option>
//                       <option value="unauthorized_charges">Unauthorized charges</option>
//                       <option value="digital_scam">Digital/online scam</option>
//                       <option value="other">Other suspicious activity</option>
//                     </select>
//                   </div>
//                 )}

//                 {formData.reportType === 'unauthorized_business' && (
//                   <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//                     <label 
//                       htmlFor="unauthorizedIssue" 
//                       style={{ 
//                         fontSize: "0.9375rem", 
//                         fontWeight: "600", 
//                         marginBottom: "0.25rem",
//                         color: "hsl(var(--foreground))"
//                       }}
//                     >
//                       Unauthorized Business Issue *
//                     </label>
//                     <select 
//                       id="unauthorizedIssue" 
//                       value={formData.unauthorizedIssue}
//                       onChange={handleChange}
//                       style={{
//                         fontSize: "1rem",
//                         padding: "0.75rem 1rem",
//                         borderRadius: "0.375rem",
//                         border: "1px solid hsla(var(--border) / 0.5)",
//                         backgroundColor: "hsla(var(--background) / 0.5)",
//                         transition: "border-color 0.2s, box-shadow 0.2s",
//                         height: "2.75rem",
//                         width: "100%"
//                       }}
//                       required={formData.reportType === 'unauthorized_business'}
//                     >
//                       <option value="">Select issue type</option>
//                       <option value="unlicensed">Operating without proper license</option>
//                       <option value="health_violations">Health code violations</option>
//                       <option value="illegal_products">Selling illegal/prohibited products</option>
//                       <option value="tax_evasion">Suspected tax evasion</option>
//                       <option value="labor_violations">Labor law violations</option>
//                       <option value="other">Other unauthorized behavior</option>
//                     </select>
//                   </div>
//                 )}

//                 {/* Item Name */}
//                 <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//                   <label 
//                     htmlFor="item" 
//                     style={{ 
//                       fontSize: "0.9375rem", 
//                       fontWeight: "600", 
//                       marginBottom: "0.25rem",
//                       color: "hsl(var(--foreground))"
//                     }}
//                   >
//                     Item Name *
//                   </label>
//                   <Input 
//                     id="item" 
//                     value={formData.item}
//                     onChange={handleChange}
//                     placeholder="Name of the product or service" 
//                     style={{
//                       fontSize: "1rem",
//                       padding: "0.75rem 1rem",
//                       borderRadius: "0.375rem",
//                       border: "1px solid hsla(var(--border) / 0.5)",
//                       backgroundColor: "hsla(var(--background) / 0.5)",
//                       transition: "border-color 0.2s, box-shadow 0.2s"
//                     }}
//                     required
//                   />
//                 </div>

//                 {/* Description */}
//                 <FormField
//                   id="description"
//                   label="Description *"
//                   placeholder="Describe what happened in detail"
//                   value={formData.description}
//                   onChange={handleChange}
//                   required
//                   as="textarea"
//                 />

//                 {/* Photo Upload */}
//                 <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//                   <label 
//                     htmlFor="photo" 
//                     style={{ 
//                       fontSize: "0.9375rem", 
//                       fontWeight: "600", 
//                       marginBottom: "0.25rem",
//                       color: "hsl(var(--foreground))"
//                     }}
//                   >
//                     {t('form.evidence.photoUpload')}
//                   </label>
//                   <div style={{
//                     border: "2px dashed hsla(var(--border) / 0.7)",
//                     borderRadius: "0.5rem",
//                     padding: "1.5rem",
//                     textAlign: "center",
//                     backgroundColor: "hsla(var(--muted) / 0.1)",
//                     cursor: "pointer"
//                   }}>
//                     <div style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       gap: "0.75rem"
//                     }}>
//                       <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
//                         <polyline points="14 2 14 8 20 8"/>
//                       </svg>
//                       <Input 
//                         id="photo" 
//                         type="file" 
//                         accept="image/*"
//                         onChange={(e) => {
//                           if (e.target.files && e.target.files[0]) {
//                             setFormData({ ...formData, photo: e.target.files[0] });
//                           }
//                         }}
//                         style={{
//                           display: "none"
//                         }}
//                       />
//                       <label htmlFor="photo" style={{
//                         cursor: "pointer",
//                         color: "hsl(var(--primary))",
//                         fontWeight: "500"
//                       }}>
//                         {t('form.evidence.photoDescription')}
//                       </label>
//                       <p style={{
//                         fontSize: "0.875rem",
//                         color: "hsl(var(--muted-foreground))"
//                       }}>
//                         {t('form.evidence.photoFormat', { format: 'PNG, JPG, or WEBP', size: '5MB' })}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Info */}
//                 <FormField
//                   id="contact"
//                   label={t('form.contact.title')}
//                   placeholder={t('form.contact.contactInfoPlaceholder')}
//                   value={formData.contact}
//                   onChange={handleChange}
//                   description={t('form.contact.privacyNote')}
//                 />
//               </div>

//               {/* Form Buttons */}
//               <div style={{
//                 marginTop: "2rem",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "1rem"
//               }}>
//                 <div style={{
//                   display: "flex",
//                   gap: "1rem",
//                   flexDirection: windowWidth >= 640 ? "row" : "column",
//                   justifyContent: windowWidth >= 640 ? "flex-end" : "stretch",
//                   width: "100%"
//                 }}>
//                   <Button 
//                     type="button" 
//                     variant="outline" 
//                     asChild 
//                     style={{
//                       padding: "0 1.5rem",
//                       height: "2.75rem"
//                     }}
//                   >
//                     <Link href="/reports">{t('form.cancel')}</Link>
//                   </Button>
//                   <Button 
//                     type="submit"
//                     style={{
//                       padding: "0 1.5rem",
//                       height: "2.75rem", 
//                       backgroundColor: "hsl(var(--primary))"
//                     }}
//                   >
//                     {t('form.submit')}
//                   </Button>
//                 </div>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ReportForm } from "../components/ReportForm";

export default function NewReportPage() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [translations, setTranslations] = useState<any>({});

  // Get locale from params
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  // Handle window resize effect - only runs client-side
  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window !== 'undefined') {
      // Set initial width
      setWindowWidth(window.innerWidth);

      // Add resize listener
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Try to load the translations for the current locale
        const translationsModule = await import(`../../../../../messages/reports/new-report.${locale}.json`);
        setTranslations(translationsModule.default);
      } catch (error) {
        // Fallback to English if the requested locale is not available
        console.error(`Failed to load translations for locale ${locale}, falling back to English`, error);
        const fallbackModule = await import(`../../../../../messages/reports/new-report.en.json`);
        setTranslations(fallbackModule.default);
      }
    };

    loadTranslations();
  }, [locale]);

  // Translation helper function
  const t = (key: string, params?: Record<string, any>): string => {
    if (!translations) return key; // Return the key if translations are not loaded yet

    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation is not found
      }
    }

    if (typeof value === 'string' && params) {
      // Replace parameters in the translation string
      return Object.entries(params).reduce((str, [param, val]) => {
        return str.replace(`{${param}}`, String(val));
      }, value);
    }

    return value;
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      padding: "2rem 1.5rem 4rem",
      backgroundColor: "hsl(var(--background))"
    }}>
      {/* Header Section */}
      <div style={{
        position: "relative",
        width: "100%",
        marginBottom: "2.5rem",
        maxWidth: "1000px",
        margin: "0 auto 3rem"
      }}>
        <div style={{
          textAlign: "center",
          padding: "2rem",
          borderRadius: "0.75rem",
          backgroundColor: "hsla(var(--primary) / 0.05)",
          marginBottom: "2rem"
        }}>
          <h1 style={{
            fontSize: windowWidth >= 768 ? "2.25rem" : "1.75rem",
            fontWeight: "700",
            color: "hsl(var(--foreground))",
            marginBottom: "0.75rem",
            lineHeight: "1.2"
          }}>
            {t('title')}
          </h1>
          <p style={{
            fontSize: windowWidth >= 768 ? "1.125rem" : "1rem",
            color: "hsl(var(--muted-foreground))",
            maxWidth: "32rem",
            margin: "0 auto",
            lineHeight: "1.5"
          }}>
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="container" style={{
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        {/* Use our new ReportForm component */}
        <ReportForm t={t} windowWidth={windowWidth} />
      </div>
    </div>
  );
}