import { useContext } from "react";
import LogoManager from "../common/LogoManager";
import { ThemeContext } from "../../context/ThemeContext";
import { text, backgrounds } from "../../utils/themeUtils";

const SettingsView = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <>
      <div className="mb-6">
        <h1 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-3xl font-bold font-dmSerif`}>
          Settings
        </h1>
        <p className={`${text.secondary[theme]} font-outfit`}>
          Manage your account preferences and notifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings Section */}
        <section>
          <h2 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-xl font-bold mb-3`}>
            Appearance
          </h2>
          <div className={`${backgrounds.card[theme]} rounded-lg p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`${text.primary[theme]} font-outfit font-medium text-lg`}>
                  Theme
                </h3>
                <p className={`${text.secondary[theme]} text-sm mt-1`}>
                  Choose between dark and light mode for the application
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleTheme}
                  className={`px-4 py-2 rounded-md ${
                    theme === 'dark' 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-white border border-slate-200 text-slate-800'
                  } transition-colors`}
                >
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Logo Management Section */}
        <section>
          <h2 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-xl font-bold mb-3`}>
            Team Logos
          </h2>
          <LogoManager />
        </section>

        {/* General Settings Section */}
        <section>
          <h2 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-xl font-bold mb-3`}>
            General Settings
          </h2>
          <div className={`${backgrounds.card[theme]} rounded-lg p-6 border`}>
            <p className={`${text.primary[theme]} font-outfit`}>
              Additional settings management interface would be displayed here.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default SettingsView;


/*

Features for SettingsView:
1. **Profile Management**: Allow users to update their profile information, including username, email, and password.
2. **Notification Preferences**: Enable users to customize their notification settings, such as email alerts for game updates, fixture changes, etc.
3. **Privacy Settings**: Provide options for users to manage their privacy settings, including who can see their profile and activity.
4. **Theme Customization**: Allow users to switch between light and dark themes or customize the app's color scheme, font in sentence case or all lowercase.
5. **Button Titles**: Provide method for users to toggle button titles on or off.
6. **Default Menu View**: Allow users to set their default view when they log in (e.g., fixtures, predictions, etc.)
7. **Account Deletion**: Provide a secure method for users to delete their account if they choose to do so.
8. **Language Preferences**: Allow users to select their preferred language for the application.
9. **Data Export**: Enable users to export their data, such as predictions and fixtures, in a downloadable format (e.g., CSV).
10. **Help and Support**: Provide a section for users to access help documentation or contact support for assistance.
11. **Accessibility Options**: Include features to enhance accessibility, such as text size adjustments or high-contrast modes.


*/
