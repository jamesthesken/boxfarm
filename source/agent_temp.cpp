#include "agent/agentclass.h"
#include "support/configCosmos.h"
#include "support/elapsedtime.h"
#include "support/timeutils.h"
#include "agent/agentclass.h"

#include <iostream>
#include <string>

using namespace std;

Agent *agent;


int main(int argc, char** argv)
{
    string nodename = "boxfarm";
    string agentname = "temp";

    agent = new Agent(nodename, agentname);
    if (agent->last_error()<0)
    {
        cout<<"unable to start agent (" << agent->last_error() << ") " << cosmos_error_string(agent->last_error()) <<endl;
        exit(1);
    }


//    string agent_name_here_soh = "{\"data_name_here\"}";
//    agent->set_sohstring(agent_name_here_soh.c_str());

    while(agent->running())
    {
        cout << "I am an agent"<< endl;
        // clear the response for next time
//        response.clear();


        // read temp data from sensor
        // option 1. arduino on serial port
        // - open serial port
        // - read serial port
        // - parse data
        // - copy temp data to soh string


        // sleep for 1 sec
        COSMOS_SLEEP(1);
    }

        return 0;
}
