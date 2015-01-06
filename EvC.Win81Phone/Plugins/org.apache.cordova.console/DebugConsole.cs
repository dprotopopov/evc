/*  
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
	
	http://www.apache.org/licenses/LICENSE-2.0
	
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

using System.Diagnostics;
using evc.cordovalib.Commands;
using evc.cordovalib.JSON;

namespace evc.Plugins.org.apache.cordova.console
{
    public class DebugConsole : BaseCommand
    {
        public void logLevel(string options)
        {
            string[] args = JsonHelper.Deserialize<string[]>(options);
            string level = args[0];
            string msg = args[1];

            if (level.Equals("LOG"))
            {
                Debug.WriteLine(msg);
            }
            else
            {
                Debug.WriteLine(level + ": " + msg);
            }
        }
    }
}
