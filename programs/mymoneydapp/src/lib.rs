use anchor_lang::prelude::*;
use anchor_spl::{
    token::{ Token},
};

declare_id!("97m9yX1LtHkBe5FVq6x8ZC7n6zVgNSq9dTdcALetuwNd");

const DUMMY_TX_ID: &str = "00000000";
const DUMMY_CREATED_ON: &str = "0000000000"; // , 10 digits
const ZERO_SIDE: i32 = 0;
const AMOUNT: u64 = 0;
const MAX_BETS_PER_USER: i32 = 10;
const RESULT_SIZE: i32 = 50;

pub fn get_id_result() -> Vec<String> {
    let mut id_vec: Vec<String> = Vec::new();
    for _ in 0..RESULT_SIZE {
        id_vec.push(DUMMY_TX_ID.to_string())
    }
    return id_vec;
}

pub fn get_result() -> Vec<i32> {
    let mut side_vec: Vec<i32> = Vec::new();
    for _ in 0..RESULT_SIZE {
        side_vec.push(ZERO_SIDE)
    }
    return side_vec;
}

pub fn get_time() -> Vec<String> {
    let mut time_vec: Vec<String> = Vec::new();
    for _ in 0..MAX_BETS_PER_USER {
        time_vec.push(DUMMY_CREATED_ON.to_string())
    }
    return time_vec;
}

pub fn get_id() -> Vec<String> {
    let mut id_vec: Vec<String> = Vec::new();
    for _ in 0..MAX_BETS_PER_USER {
        id_vec.push(DUMMY_TX_ID.to_string())
    }
    return id_vec;
}

pub fn get_amount() -> Vec<u64> {
    let mut amount_vec: Vec<u64> = Vec::new();
    for _ in 0..MAX_BETS_PER_USER {
        amount_vec.push(AMOUNT)
    }
    return amount_vec;
}

pub fn get_side() -> Vec<i32> {
    let mut side_vec: Vec<i32> = Vec::new();
    for _ in 0..MAX_BETS_PER_USER {
        side_vec.push(ZERO_SIDE)
    }
    return side_vec;
}

pub fn get_odds() -> Vec<i64> {
    let mut id_vec: Vec<i64> = Vec::new();
    for _ in 0..RESULT_SIZE {
        id_vec.push(0)
    }
    return id_vec;
}

pub fn get_fees_in_sol(amount: u64) -> u64 {
    if amount < 500000000{
        return 20000000
    }
    if amount > 500000000 && amount < 1000000000{
        return 30000000
    }
    if amount > 1000000000 && amount < 5000000000{
        return 90000000
    }
    else{
        return amount/20
    }

}

pub fn amount_after_odds(amount: u64, odds: i64) -> u64{
    let amount_to_pay = amount as i64 * odds;
    return amount_to_pay as u64;
}

#[program]
pub mod mymoneydapp {
    use super::*;
   
    pub fn place_single_bet(ctx:Context<PlaceSingleBet>,
        user_key: String, 
        amount: u64,
        id: String, 
        side: i32, 
        time: String, 
        fee_in_cato: i32, 
        amount_fee_cato: u64) -> ProgramResult {
        let bets = &mut ctx.accounts.bets;
        msg!("Is initialised: {:?}", bets.initialised);
        if bets.initialised == true
        {
            msg!("Already initialised {:?}", bets.initialised);
        }
        else{
            bets.id = get_id();
            bets.amount = get_amount();
            bets.side = get_side();
            bets.time = get_time();
            bets.user_key = user_key;
            bets.initialised = true;
        }
        //transfer sol from user to program_account
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &mut ctx.accounts.user.key(),
            &bets.key(),
            amount,
        );
        let a = anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                bets.to_account_info(),
            ],
        );
        match a {
            Ok(()) => msg!("Done transfer"),
            Err(e) => msg!("Error {:?}", e),
        }
        if fee_in_cato < 0 || fee_in_cato > 1
        {
            panic!("Wrong input for fees type")
        }
        if amount == 0
        {
            panic!("Amount is 0!");
        }
        if side < 1 || side > 2
        {
            panic!("Invalid side");
        }
        if id.len() != 8
        {
            panic!("Invalid id");
        }
        if time.len() != 10
        {
            panic!("Invalid time")
        }
        let mut fees = amount;
        #[allow(unused_assignments)]
        let mut remaining_amount = 0;
        let commission_account = &mut ctx.accounts.commission_account;
        let service_account = &mut ctx.accounts.service_account;
        if fee_in_cato == 1{
                let a = { anchor_spl::token::transfer(
                    CpiContext::new(
                        ctx.accounts.token_program.to_account_info(),
                        anchor_spl::token::Transfer {
                            from: ctx.accounts.from_account_cato.to_account_info(),
                            to: ctx.accounts.to_account_cato.to_account_info(),
                            // The offer_maker had to sign from the client
                            authority: ctx.accounts.user.to_account_info(),
                        },
                    ),
                    amount_fee_cato*1000000000,
                )};
                match a {
                    Ok(()) => msg!("Done"),
                    Err(e) => msg!("Error {:?}", e),
                }
                remaining_amount = amount;
                **bets.to_account_info().try_borrow_mut_lamports()? -= amount;
        }
        else{
                fees = get_fees_in_sol(amount);
                remaining_amount = amount - fees;
                **bets.to_account_info().try_borrow_mut_lamports()? -= fees + remaining_amount;
                **commission_account.try_borrow_mut_lamports()? += fees;
        }


        msg!("fees: {:?}", fees);
        msg!("amount: {:?}", amount);
        msg!("remaining_amount: {:?}", remaining_amount);

        **service_account.try_borrow_mut_lamports()? += remaining_amount;
        msg!("Amount transferred");
        let index = bets.side.iter().position(|p| *p == i32::from(0)).unwrap(); 
        bets.amount[index] = amount;
        bets.id[index] = id;
        bets.side[index] = side;
        bets.time[index] = time;
        Ok(())
    }

    pub fn create(ctx:Context<CreateAccount>, user_key: String) -> ProgramResult {
        let bets = &mut ctx.accounts.bets;
        if bets.initialised == true
        {
            msg!("Error {:?}", bets.user_key);
        }
        else{
            bets.id = get_id();
            bets.amount = get_amount();
            bets.side = get_side();
            bets.time = get_time();
            bets.user_key = user_key;
            bets.initialised = true;
        }
        Ok(())
    }

    pub fn settle_result<'info>(ctx: Context<SettleResult>, result: i32, id: String) -> ProgramResult{
        let bets = &mut ctx.accounts.bets;
        let results = &mut ctx.accounts.results;
        let index = results.id.iter().position(|p| *p == id).unwrap();
        if results.side[index] !=  result 
        {
            panic!("Unauthorized access to put in wrong result");
        }
        let index_bet = bets.id.iter().position(|p| *p == id).unwrap();
        let odd_to_distribute = results.odds[index];
        if bets.side[index_bet] != result
        {
            panic!("Wrong result being tried!");
        }
        let amount = bets.amount[index_bet];
        bets.side[index_bet] = 0;
        let final_amount = amount_after_odds(amount, odd_to_distribute);
        let service_account = &mut ctx.accounts.service_account;
        let _program_account = &mut ctx.accounts.program_account;
        let to_account = &mut ctx.accounts.to_account_owner;
        **service_account.try_borrow_mut_lamports()? -= final_amount;
        **to_account.try_borrow_mut_lamports()? += final_amount;
        Ok(())
    }

    pub fn feed_result<'info>(ctx: Context<FeedResult>, result: i32, id: String, index: u16, odds: i64) -> ProgramResult{
        let results = &mut ctx.accounts.results;
        results.id[usize::from(index)] = id;
        results.side[usize::from(index)] = result;
        results.odds[usize::from(index)] = odds;
        Ok(())
    }

    pub fn create_result<'info>(ctx: Context<CreateResult>) -> ProgramResult {
        let results = &mut ctx.accounts.results;
        results.id = get_id_result();
        results.side = get_result();
        results.odds = get_odds();
        Ok(())
    }

    pub fn safety_result<'info>(ctx: Context<SafetyResult>, amount: u64) -> ProgramResult {
        let program_account = &mut ctx.accounts.from_account;
        let to_account = &mut ctx.accounts.to_account;
        **program_account.try_borrow_mut_lamports()? -= amount;
        **to_account.try_borrow_mut_lamports()? += amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct PlaceSingleBet<'info> {
    #[account(init_if_needed, payer = user, space = 480)]
    pub bets: Account<'info, Bets>,
    #[account(mut)]
    pub from_account_cato: AccountInfo<'info>,
    #[account(mut)]
    pub to_account_cato: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub service_account: AccountInfo<'info>,
    #[account(mut)]
    pub commission_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateAccount<'info> {
    #[account(init_if_needed, payer = user, space = 640)]
    pub bets: Account<'info, Bets>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettleResult<'info>{
    #[account(mut)]
    pub bets: Account<'info, Bets>,
    pub results: Account<'info, Results>,
    #[account(mut)]
    pub service_account: AccountInfo<'info>,
    #[account(mut)]
    pub program_account: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub to_account_owner: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SafetyResult<'info>{
    #[account(mut)]
    pub from_account: AccountInfo<'info>,
    #[account(mut)]
    pub to_account: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FeedResult<'info>{
    #[account(mut)]
    pub results: Account<'info, Results>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateResult<'info> {
    #[account(init_if_needed, payer = user, space = 1600)]
    pub results: Account<'info, Results>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Bets {
    pub id: Vec<String>,
    pub amount: Vec<u64>,
    pub time: Vec<String>,
    pub side: Vec<i32>,
    pub initialised: bool,
    pub user_key: String
}

#[account]
pub struct Results {
    pub id: Vec<String>,
    pub side: Vec<i32>,
    pub odds: Vec<i64>
}