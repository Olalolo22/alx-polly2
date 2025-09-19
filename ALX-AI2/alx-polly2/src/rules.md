# UI Component Improvement Rules

1. **Component Reusability:**  
   All new UI elements (forms, buttons, alerts) should be implemented as reusable components in the `@/components/ui/` directory.

2. **Security Best Practices:**  
   Never expose sensitive information in the UI. Validate and sanitize all user inputs, and handle authentication tokens securely.

3. **Consistent Error Handling:**  
   Display user-friendly error messages using a dedicated error alert component. Avoid leaking technical details.

4. **Performance Optimization:**  
   Use loading states and avoid unnecessary re-renders. Lazy-load non-critical components where possible.

5. **Accessibility & UX:**  
   Ensure all form fields are labeled, support keyboard navigation, and provide clear feedback for user actions.
