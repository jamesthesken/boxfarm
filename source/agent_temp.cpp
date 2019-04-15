#include "agent/agentclass.h"
#include "support/configCosmos.h"
#include "support/elapsedtime.h"
#include "support/timeutils.h"
#include "agent/agentclass.h"

#include <iostream>
#include <string>
# include <fstream>


using namespace std;


int main()
{
    Agent *agent;
    string nodename = "boxfarm";
    string agentname = "temp";

    agent = new Agent(nodename, agentname);
    if (agent->last_error()<0)
    {
        cout<<"unable to start agent (" << agent->last_error() << ") " << cosmos_error_string(agent->last_error()) <<endl;
        exit(1);
    }


    string agent_name_here_soh = "{\"data_name_here\"}";
    agent->set_sohstring(agent_name_here_soh.c_str());

    while(agent->running())
    {
        string message {"helloBB"};

        cout << "I am an agent"<< endl;

        agent->post((Agent::AgentMessage)0xBB, message);




        // sleep for 1 sec
        COSMOS_SLEEP(1);
    }

        return 0;
}
